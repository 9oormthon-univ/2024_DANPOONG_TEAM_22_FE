package com.wavrecorder;

import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.media.MediaPlayer;
import android.os.Environment;
import android.os.Build;
import android.Manifest;
import android.content.pm.PackageManager;
import android.app.Activity;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;

public class WavRecorderModule extends ReactContextBaseJavaModule implements PermissionListener {
    private AudioRecord audioRecord;
    private Thread recordingThread;
    private boolean isRecording = false;
    private boolean isPaused = false; // 일시중지 상태 여부 변수
    private String filePath;
    
    // 권한 요청 관련 상수
    private static final int PERMISSION_REQUEST_CODE = 1000;
    private Promise permissionPromise;
    private String pendingFileName;

    // 녹음 설정 (필요에 따라 수정 가능)
    private final int audioSource = MediaRecorder.AudioSource.MIC; // 오디오 소스 설정
    private final int sampleRate = 44100; // 샘플링 레이트 설정
    private final int channelConfig = AudioFormat.CHANNEL_IN_MONO;  // 모노
    private final int audioFormat = AudioFormat.ENCODING_PCM_16BIT; // 16비트 PCM 형식
    private final int bufferSize = AudioRecord.getMinBufferSize(sampleRate, channelConfig, audioFormat);

    // 마지막으로 측정된 볼륨(dB) 값을 저장 (동시성 고려)
    private volatile double currentMetering = 0.0;

    public WavRecorderModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "WavRecorder";
    }

    /**
     * 마이크 권한 확인 메서드
     * @return 권한이 있으면 true, 없으면 false
     */
    private boolean checkRecordAudioPermission() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return true; // Android 6.0 미만은 설치 시 권한 부여됨
        }
        
        return getReactApplicationContext().checkSelfPermission(Manifest.permission.RECORD_AUDIO) 
                == PackageManager.PERMISSION_GRANTED;
    }

    /**
     * 마이크 권한 요청 메서드
     * @param promise React Native에서 결과 전달용 Promise 객체
     */
    @ReactMethod
    public void requestRecordAudioPermission(Promise promise) {
        if (checkRecordAudioPermission()) {
            // 이미 권한이 있는 경우
            promise.resolve(true);
            return;
        }

        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject("ACTIVITY_NULL", "현재 액티비티가 없습니다.");
            return;
        }

        if (!(currentActivity instanceof PermissionAwareActivity)) {
            promise.reject("ACTIVITY_ERROR", "현재 액티비티가 PermissionAwareActivity를 구현하지 않았습니다.");
            return;
        }

        permissionPromise = promise;
        
        try {
            PermissionAwareActivity permissionAwareActivity = (PermissionAwareActivity) currentActivity;
            permissionAwareActivity.requestPermissions(
                    new String[]{Manifest.permission.RECORD_AUDIO},
                    PERMISSION_REQUEST_CODE,
                    this
            );
        } catch (Exception e) {
            permissionPromise.reject("PERMISSION_ERROR", e);
            permissionPromise = null;
        }
    }

    @Override
    public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == PERMISSION_REQUEST_CODE && permissionPromise != null) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                permissionPromise.resolve(true);
                
                // 권한 획득 후 대기 중인 녹음 시작
                if (pendingFileName != null) {
                    String fileName = pendingFileName;
                    pendingFileName = null;
                    startRecordingInternal(fileName, permissionPromise);
                }
            } else {
                permissionPromise.resolve(false);
            }
            permissionPromise = null;
            return true;
        }
        return false;
    }

    /**
     * 녹음 시작 메서드 - 권한 체크 후 실행
     * @param fileName 저장할 파일명 (예: "recording.wav")
     * @param promise React Native에서 비동기 결과 전달용 Promise 객체
     */
    @ReactMethod
    public void startRecording(String fileName, Promise promise) {
        if (!checkRecordAudioPermission()) {
            // 권한이 없는 경우 권한 요청
            pendingFileName = fileName;
            requestRecordAudioPermission(promise);
            return;
        }
        
        // 권한이 있는 경우 녹음 시작
        startRecordingInternal(fileName, promise);
    }

    /**
     * 실제 녹음 시작 내부 메서드 (권한 확인 후 호출됨)
     * @param fileName 저장할 파일명
     * @param promise React Native에서 비동기 결과 전달용 Promise 객체
     */
    private void startRecordingInternal(String fileName, Promise promise) {
        try {
            // 외부 파일 디렉토리의 Music 폴더에 파일 경로를 구성
            filePath = getReactApplicationContext().getExternalFilesDir(Environment.DIRECTORY_MUSIC) + "/" + fileName;
            File file = new File(filePath);

            // 같은 이름의 파일이 있을 경우 삭제하여 초기화
            if (file.exists()) {
                file.delete();
            }

            // 녹음 시작 전에 일시중지 상태 플래그 초기화
            isPaused = false;

            // AudioRecord 객체 생성 후 녹음 시작
            audioRecord = new AudioRecord(audioSource, sampleRate, channelConfig, audioFormat, bufferSize);
            audioRecord.startRecording();
            isRecording = true;

            // 별도의 스레드에서 PCM 데이터를 파일로 기록 및 음량 계산
            recordingThread = new Thread(new Runnable() {
                @Override
                public void run() {
                    writeAudioDataToFile(filePath);
                }
            });
            recordingThread.start();

            // 성공적으로 녹음을 시작했음을 React Native 쪽에 전달
            promise.resolve("안드로이드 녹음 시작됨");
        } catch (Exception e) {
            promise.reject("START_ERROR", e);
        }
    }

    /**
     * 녹음 일시중지 메서드
     * @param promise React Native에서 결과 전달용 Promise 객체
     */
    @ReactMethod
    public void pauseRecording(Promise promise) {
        try {
            if (audioRecord != null && isRecording && !isPaused) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    audioRecord.stop(); // 일시중지는 stop() 메서드 사용 (대체 방법 고려 가능)
                }
                isPaused = true;
                promise.resolve("녹음 일시중지됨");
            } else {
                promise.reject("PAUSE_ERROR", "녹음이 시작되지 않았거나 이미 일시중지 상태입니다.");
            }
        } catch (Exception e) {
            promise.reject("PAUSE_ERROR", e);
        }
    }

    /**
     * 녹음 재개 메서드
     * @param promise React Native에서 결과 전달용 Promise 객체
     */
    @ReactMethod
    public void resumeRecording(Promise promise) {
        try {
            // 녹음 진행 중이고 현재 일시중지 상태일 경우 재개
            if (audioRecord != null && isRecording && isPaused) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    audioRecord.startRecording();
                }
                isPaused = false;
                promise.resolve("녹음 재개됨");
            } else {
                promise.reject("RESUME_ERROR", "녹음이 시작되지 않았거나 일시중지 상태가 아닙니다.");
            }
        } catch (Exception e) {
            promise.reject("RESUME_ERROR", e);
        }
    }

    /**
     * 녹음 종료 메서드
     * @param promise React Native에서 결과 전달용 Promise 객체
     */
    @ReactMethod
    public void stopRecording(Promise promise) {
        try {
            isRecording = false;
            if (audioRecord != null) {
                if (isPaused && Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    audioRecord.startRecording();
                }
                audioRecord.stop();
                audioRecord.release();
                audioRecord = null;
            }
            if (recordingThread != null) {
                recordingThread.join();
                recordingThread = null;
            }
            promise.resolve(filePath);
        } catch (Exception e) {
            promise.reject("STOP_ERROR", e);
        }
    }

    /**
     * 녹음 파일 재생 메서드
     * @param promise React Native에서 결과 전달용 Promise 객체
     */
    @ReactMethod
    public void playRecording(Promise promise) {
        try {
            if (filePath == null || filePath.isEmpty()) {
                promise.reject("PLAY_ERROR", "녹음된 파일이 없습니다.");
                return;
            }
            MediaPlayer mediaPlayer = new MediaPlayer();
            mediaPlayer.setDataSource(filePath);
            mediaPlayer.prepare();
            mediaPlayer.start();
            promise.resolve("재생 시작됨");
        } catch (Exception e) {
            promise.reject("PLAY_ERROR", e);
        }
    }

    /**
     * AudioRecord로부터 PCM 데이터를 읽어 파일에 기록하면서,
     * 동시에 음량을 측정(dB 값 계산)하여 네이티브 이벤트로 전달하는 메서드
     * @param filePath 녹음 파일 경로
     */
    private void writeAudioDataToFile(String filePath) {
        RandomAccessFile wavFile = null;
        long totalAudioLen = 0;
        try {
            wavFile = new RandomAccessFile(filePath, "rw");
            // WAV 파일 헤더 영역(44바이트)을 위한 공간 예약
            byte[] header = new byte[44];
            wavFile.write(header, 0, 44);

            byte[] buffer = new byte[bufferSize];
            while (isRecording) {
                if (isPaused) {
                    try {
                        Thread.sleep(100);
                        continue;
                    } catch (InterruptedException e) {
                        // 예외 발생 시 무시하고 진행
                    }
                }
                int read = audioRecord.read(buffer, 0, buffer.length);
                if (read > 0) {
                    wavFile.write(buffer, 0, read);
                    totalAudioLen += read;

                    // 16비트 PCM 볼륨 계산 (RMS 기반)
                    int numSamples = read / 2;
                    long sum = 0;
                    for (int i = 0; i < numSamples; i++) {
                        int low = buffer[i * 2] & 0xff; 
                        int high = buffer[i * 2 + 1];
                        short sample = (short) ((high << 8) | low);
                        sum += sample * sample;
                    }
                    double rms = Math.sqrt(sum / (double) numSamples);
                    double dB = 20 * Math.log10(rms);

                    // 최신 볼륨 값을 저장하고 이벤트 전송
                    currentMetering = dB;
                    sendVolumeEvent(dB);
                }
            }

            wavFile.seek(0);
            writeWavHeader(wavFile, totalAudioLen, sampleRate,
                    (channelConfig == AudioFormat.CHANNEL_IN_MONO) ? 1 : 2, 16);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (wavFile != null) {
                try {
                    wavFile.close();
                } catch (IOException e) {
                    // 예외 발생 시 무시
                }
            }
        }
    }

    /**
     * WAV 파일 헤더 작성 메서드
     * @param out RandomAccessFile 객체
     * @param totalAudioLen PCM 데이터 길이
     * @param sampleRate 샘플링 레이트
     * @param channels 채널 수 (1: 모노, 2: 스테레오)
     * @param bitsPerSample 비트 깊이 (16비트)
     */
    private void writeWavHeader(RandomAccessFile out, long totalAudioLen, int sampleRate, int channels, int bitsPerSample) throws IOException {
        long totalDataLen = totalAudioLen + 36;
        int byteRate = sampleRate * channels * bitsPerSample / 8;
        byte[] header = new byte[44];

        header[0] = 'R'; header[1] = 'I'; header[2] = 'F'; header[3] = 'F';
        header[4] = (byte) (totalDataLen & 0xff);
        header[5] = (byte) ((totalDataLen >> 8) & 0xff);
        header[6] = (byte) ((totalDataLen >> 16) & 0xff);
        header[7] = (byte) ((totalDataLen >> 24) & 0xff);
        header[8] = 'W'; header[9] = 'A'; header[10] = 'V'; header[11] = 'E';
        header[12] = 'f'; header[13] = 'm'; header[14] = 't'; header[15] = ' ';
        header[16] = 16; header[17] = 0; header[18] = 0; header[19] = 0;
        header[20] = 1; header[21] = 0;
        header[22] = (byte) channels; header[23] = 0;
        header[24] = (byte) (sampleRate & 0xff);
        header[25] = (byte) ((sampleRate >> 8) & 0xff);
        header[26] = (byte) ((sampleRate >> 16) & 0xff);
        header[27] = (byte) ((sampleRate >> 24) & 0xff);
        header[28] = (byte) (byteRate & 0xff);
        header[29] = (byte) ((byteRate >> 8) & 0xff);
        header[30] = (byte) ((byteRate >> 16) & 0xff);
        header[31] = (byte) ((byteRate >> 24) & 0xff);
        header[32] = (byte) (channels * bitsPerSample / 8); header[33] = 0;
        header[34] = (byte) bitsPerSample; header[35] = 0;
        header[36] = 'd'; header[37] = 'a'; header[38] = 't'; header[39] = 'a';
        header[40] = (byte) (totalAudioLen & 0xff);
        header[41] = (byte) ((totalAudioLen >> 8) & 0xff);
        header[42] = (byte) ((totalAudioLen >> 16) & 0xff);
        header[43] = (byte) ((totalAudioLen >> 24) & 0xff);

        out.write(header, 0, 44);
    }

    /**
     * 계산된 dB 값을 React Native 측으로 이벤트 전송하는 메서드
     * (JavaScript에서는 NativeEventEmitter를 통해 'volumeUpdate' 이벤트를 수신할 수 있습니다.)
     */
    private void sendVolumeEvent(double dB) {
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("volumeUpdate", dB);
    }

    /**
     * 현재까지 측정된 볼륨(dB) 값을 React Native에 반환하는 메서드
     * JS 쪽에서 WavRecorder.getCurrentMetering() 로 호출할 수 있습니다.
     */
    @ReactMethod
    public void getCurrentMetering(Promise promise) {
        promise.resolve(currentMetering);
    }

    /**
     * 마이크 권한 상태를 확인하는 메서드
     * JS 쪽에서 WavRecorder.checkPermissionStatus() 로 호출할 수 있습니다.
     * @param promise React Native에서 결과 전달용 Promise 객체
     */
    @ReactMethod
    public void checkPermissionStatus(Promise promise) {
        boolean hasPermission = checkRecordAudioPermission();
        promise.resolve(hasPermission);
    }
}