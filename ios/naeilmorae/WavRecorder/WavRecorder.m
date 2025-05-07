#import "WavRecorder.h"
#import <AVFoundation/AVFoundation.h>

@interface WavRecorder ()
@property (nonatomic, strong) AVAudioRecorder *audioRecorder;
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
  [self.audioRecorder stop];
  [self stopMetering];

  if (self.audioRecorder.url.path) {
    resolve(self.audioRecorder.url.path);
  } else {
    reject(@"STOP_RECORDING_FAILED", @"녹음 중지 실패", nil);
  }

  self.audioRecorder = nil;
}

RCT_EXPORT_METHOD(playRecording:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve(@"iOS 플레이는 직접 구현 필요");
}

RCT_EXPORT_METHOD(stopPlaying:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve(@"iOS 플레이어 정지");
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

@end
