#import "WavRecorder.h"
#import <AVFoundation/AVFoundation.h>

@interface WavRecorder ()
@property (nonatomic, strong) AVAudioRecorder *audioRecorder;
@property (nonatomic, strong) AVAudioPlayer *audioPlayer;
@property (nonatomic, strong) NSTimer *meterTimer;
@end

@implementation WavRecorder

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

RCT_EXPORT_METHOD(checkPermissionStatus:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  AVAudioSessionRecordPermission permission = [[AVAudioSession sharedInstance] recordPermission];
  resolve(@(permission == AVAudioSessionRecordPermissionGranted));
}

RCT_EXPORT_METHOD(requestRecordAudioPermission:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  [[AVAudioSession sharedInstance] requestRecordPermission:^(BOOL granted) {
    resolve(@(granted));
  }];
}

RCT_EXPORT_METHOD(startRecording:(NSString *)fileName resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    AVAudioSession *session = [AVAudioSession sharedInstance];
    [session setCategory:AVAudioSessionCategoryPlayAndRecord error:nil];
    [session setActive:YES error:nil];

    NSURL *fileURL = [[self getDocumentsDirectory] URLByAppendingPathComponent:fileName];

    // 로그로 파일 경로 확인
    NSLog(@"녹음 파일 경로: %@", fileURL.path);
    
    NSDictionary *settings = @{
      AVFormatIDKey: @(kAudioFormatLinearPCM),
      AVSampleRateKey: @(44100),
      AVNumberOfChannelsKey: @(2),
      AVLinearPCMBitDepthKey: @(16),
      AVLinearPCMIsBigEndianKey: @(NO),
      AVLinearPCMIsFloatKey: @(NO)
    };

    self.audioRecorder = [[AVAudioRecorder alloc] initWithURL:fileURL settings:settings error:nil];
    self.audioRecorder.meteringEnabled = YES;
    [self.audioRecorder prepareToRecord];
    [self.audioRecorder record];

    [self startMetering];

    resolve(fileURL.path);
  }
  @catch (NSException *exception) {
    reject(@"START_RECORDING_FAILED", @"녹음 시작 실패", nil);
  }
}

RCT_EXPORT_METHOD(stopRecording:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  if (self.audioRecorder == nil) {
    resolve(nil); // 녹음 안 한 경우에도 안전하게 종료
    return;
  }

  [self.audioRecorder stop];
  [self stopMetering];

  NSURL *pcmURL = self.audioRecorder.url;
  NSURL *wavURL = [self getDocumentsDirectory];
  wavURL = [wavURL URLByAppendingPathComponent:@"recording.wav"]; // WAV 파일 이름 설정

  [self convertPCMToWav:pcmURL wavURL:wavURL];

  // 로그로 경로 확인
  NSLog(@"녹음 파일 경로: %@", wavURL.path);
  
  if (wavURL.path) {
    resolve(wavURL.path);
  } else {
    reject(@"STOP_RECORDING_FAILED", @"녹음 중지 실패", nil);
  }

  self.audioRecorder = nil;
}

RCT_EXPORT_METHOD(playRecording:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSURL *documentsDirectory = [self getDocumentsDirectory];
  NSURL *wavURL = [documentsDirectory URLByAppendingPathComponent:@"recording.wav"]; // WAV 파일 경로

  if (![[NSFileManager defaultManager] fileExistsAtPath:wavURL.path]) {
    reject(@"PLAYBACK_FAILED", @"녹음된 파일이 없습니다", nil);
    return;
  }

  NSError *error = nil;
  AVAudioPlayer *audioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:wavURL error:&error];

  if (error) {
    reject(@"PLAYBACK_FAILED", @"오디오 파일 재생 실패", error);
    return;
  }

  [audioPlayer prepareToPlay];
  [audioPlayer play];

  self.audioPlayer = audioPlayer; // 플레이어 객체 저장

  resolve(@"iOS 플레이 시작됨");
}

RCT_EXPORT_METHOD(stopPlaying:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  [self.audioPlayer stop];
  resolve(@"플레이어 정지");
}

RCT_EXPORT_METHOD(getCurrentMetering:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  [self.audioRecorder updateMeters];
  float averagePower = [self.audioRecorder averagePowerForChannel:0];
  resolve(@(averagePower));
}

- (void)startMetering {
  self.meterTimer = [NSTimer scheduledTimerWithTimeInterval:0.1 repeats:YES block:^(NSTimer * _Nonnull timer) {
    [self.audioRecorder updateMeters];
  }];
}

- (void)stopMetering {
  [self.meterTimer invalidate];
  self.meterTimer = nil;
}

- (NSURL *)getDocumentsDirectory {
  return [[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] firstObject];
}

// PCM -> WAV 변환 함수
- (void)convertPCMToWav:(NSURL *)pcmURL wavURL:(NSURL *)wavURL {
  NSLog(@"PCM 파일 경로: %@", pcmURL);
  NSLog(@"WAV 파일 경로: %@", wavURL);
  
  NSFileHandle *pcmHandle = [NSFileHandle fileHandleForReadingFromURL:pcmURL error:nil];
  NSData *pcmData = [pcmHandle readDataToEndOfFile];
  [pcmHandle closeFile];
  
  if (pcmData.length == 0) {
    NSLog(@"PCM 파일이 비어있습니다.");
  }

  NSUInteger pcmDataLength = pcmData.length;
  NSUInteger totalDataLength = pcmDataLength + 36;

  NSMutableData *wavData = [NSMutableData data];

  // 1. "RIFF" chunk descriptor
  [wavData appendData:[@"RIFF" dataUsingEncoding:NSASCIIStringEncoding]];
  [wavData appendBytes:&totalDataLength length:4];
  [wavData appendData:[@"WAVE" dataUsingEncoding:NSASCIIStringEncoding]];

  // 2. "fmt " sub-chunk
  [wavData appendData:[@"fmt " dataUsingEncoding:NSASCIIStringEncoding]];
  
  UInt32 subChunk1Size = 16;
  UInt16 audioFormat = 1;  // PCM = 1
  UInt16 numChannels = 2;  // 스테레오
  UInt32 sampleRate = 44100;
  UInt32 byteRate = sampleRate * numChannels * 2;  // 16bit = 2bytes
  UInt16 blockAlign = numChannels * 2;
  UInt16 bitsPerSample = 16;

  [wavData appendBytes:&subChunk1Size length:4];
  [wavData appendBytes:&audioFormat length:2];
  [wavData appendBytes:&numChannels length:2];
  [wavData appendBytes:&sampleRate length:4];
  [wavData appendBytes:&byteRate length:4];
  [wavData appendBytes:&blockAlign length:2];
  [wavData appendBytes:&bitsPerSample length:2];

  // 3. "data" sub-chunk
  [wavData appendData:[@"data" dataUsingEncoding:NSASCIIStringEncoding]];
  [wavData appendBytes:&pcmDataLength length:4];
  [wavData appendData:pcmData];

  // 4. Save to file
  [wavData writeToURL:wavURL atomically:YES];
  
  if ([[NSFileManager defaultManager] fileExistsAtPath:wavURL.path]) {
    NSLog(@"WAV 파일이 성공적으로 생성되었습니다.");
  } else {
    NSLog(@"WAV 파일 생성 실패.");
  }
}

@end
