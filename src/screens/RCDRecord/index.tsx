import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av'
import RCDWave from '@components/atom/RCDWave'
import BG from '@components/atom/BG'
import RCDBtnBar from '@components/molecule/RCDBtnBar'
import RCDTimer from '@components/atom/RCDTimer'
import { AudioOption } from '../../libs/constants/AudioOption'
import Txt from '@components/atom/Txt'
import Button from '@components/atom/button/Button'
import Notice1 from '../../../assets/svgs/Notice1.svg'
import Notice2 from '../../../assets/svgs/Notice2.svg'
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native'
import { HomeStackParamList } from '../../types/HomeStackParamList'
import { postVoiceAnalysis } from '@apis/RCDApis/postVoiceAnalysis'
import AppBar from '@components/atom/AppBar'

const RCDRecordScreen = ({route}: {route: RouteProp<HomeStackParamList, 'RCDRecord'>}) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>()
  const {item,gptRes,alarmId,voiceFileId,content,type} = route.params;
  const [isError,setIsError] = useState<boolean>(false)
  const [errType,setErrType] = useState<'bad'|'noisy'|'server'>('bad')
  // 
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined) // 녹음 상태 관리
  const [permissionResponse, requestPermission] = Audio.usePermissions() // 오디오 권한 요청 및 응답 관리
  const [uri, setUri] = useState<string | null>(null) // 녹음 종료시 생성된 URI 
  const [sound, setSound] = useState<Audio.Sound | undefined>() // uri로 생성된 오디오 객체
  //
  const [volumeList, setVolumeList] = useState<number[]>([]) // 볼륨 리스트 관리
  const [isPaused, setIsPaused] = useState<boolean>(false) // 녹음 일시정지 상태 관리
  const [isPlaying, setIsPlaying] = useState<boolean>(false) // 재생 상태 관리
  const [isDone, setIsDone] = useState<boolean>(false) // 녹음 완료 상태 관리


  
  //test
  // useEffect(()=>{
  //   console.log(!!recording,isPaused,isDone,isPlaying)
  // },[isPaused,isPlaying,isDone,recording ])

  useEffect(()=>{
    //화면에 처음들어왔을때 새 녹음을 위하여 값들을 초기화
    refleshRCDStates
  },[])

  //녹음을 시작하기 위해 값들을 초기화
  const refleshRCDStates = ()=>{ 
    setIsDone(false)
    setIsPaused(false)
    setIsPlaying(false)
    setVolumeList([])
    setRecording(undefined)
    setUri(null)
    setSound(undefined)
  }

  // 녹음을 시작하는 비동기 함수
  const startRecording = async () => {
    try {
      // 녹음이 이미 진행 중인지 확인
      if (recording) return

      // 권한이 없으면 권한 요청
      if (!permissionResponse || permissionResponse.status !== 'granted')
        await requestPermission()

      // 오디오 모드 설정
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true, // 녹음 가능
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix, // 다른 앱 소리 안나게함 // test: X
        interruptionModeIOS: InterruptionModeIOS.DoNotMix, // 다른 앱 소리 안나게함
        // playThroughEarpieceAndroid: true, // 이어폰을 통해 오디오 재생 가능  // test: 녹음시 다른 앱 소리 안나게함
        // playsInSilentModeIOS: false, // 무음모드에서 오디오 재생 가능
        shouldDuckAndroid: false, // 백그라운드 오디오 음량 조절 가능 // test: true: 다른앱 duck -> 재생 끝나면 다른앱 정지 false: 다른앱 정지
        staysActiveInBackground: false, // 앱이 백그라운드에 있을 때 오디오(재생,녹음) 비활성 // test: O
      })

      // 녹음 시작
      const recordingObject = await Audio.Recording.createAsync(AudioOption)
      setRecording(recordingObject.recording)
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }

  // 녹음을 일시정지 또는 재개
  const togglePauseRecording = async () => {
    if (recording) {
      if (isPaused) {
        await recording.startAsync()
        setIsPaused(false)
      } else {
        await recording.pauseAsync()
        setIsPaused(true)
      }
    }
  }

  // 녹음을 중지
  const stopRecording = async () => {
    setRecording(undefined)
    // 녹음 중지 및 언로드
    await recording?.stopAndUnloadAsync()
    // 오디오 모드를 녹음 불가로 설정
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    })
    // 녹음 파일의 URI를 가져옴
    const uri = recording?.getURI() ?? null
    setUri(uri)
    setIsDone(true)
  }

  // 녹음 파일을 재생
  const playSound = async () => {
    if (uri && !isPlaying) {

      const { sound } = await Audio.Sound.createAsync({uri,})
      setSound(sound)
      setIsPlaying(true)
      await sound.playAsync() // 녹음 재생 함수 
      await new Promise(resolve => setTimeout(resolve, volumeList.length*100)); // 녹음 재생 시간 만큼 딜레이
      setIsPlaying(false)
      console.log('playSound')
    }
  }

  // 파일을 서버로 업로드하는 함수
  const uploadRecording = async () => {
    if (uri) {
      try {
        const file = new FormData()
        file.append('file', {
          uri: uri,
          name: 'recording.wav', 
          type: 'audio/wav'
        } as any)

        const response = await postVoiceAnalysis(file,voiceFileId)
        console.log('음성 파일 분석 결과:', response)
        navigation.navigate('RCDFeedBack')
      } catch (error: any) {
        if(error.response?.data.code === 'ANALYSIS0001') {
          setIsError(true)
          setErrType('bad')
        } else if (error.response?.data.code === 'ANALYSIS0002'){
          setIsError(true)
          setErrType('noisy')
        }else{
          setIsError(true)
          setErrType('server')
        }
        console.error('음성 파일 업로드 오류:', error)
      }
    } else {
      console.error('업로드할 녹음 파일이 없습니다')
    }
  }

  // 볼륨 업데이트 함수
  const updateVolume = async () => {
    if (recording) {
      const status = await recording.getStatusAsync() // recording 의 status 를 가져온다.
      if (status.isRecording) {
        setVolumeList((prev) => [...prev, status.metering ?? 0])
      }
    }
  }

  // 볼륨 업데이트를 위한 useEffect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (recording) {
      interval = setInterval(updateVolume, 100) // 100ms마다 볼륨 업데이트
    }
    return () => clearInterval(interval)
  }, [recording])

  return (
    <BG type="solid">
     
      {!isError?(  
        <>
          <AppBar
          title=''
          goBackCallbackFn={() => {navigation.goBack()}}
          className="absolute top-[0] w-full"
        />
      <View className='flex-1 justify-between mt-[65]'>{/* frame */}
      
        {/* up section */}
        <View className='px-px pt-[0] h-[250]'>
          <ScrollView className='h-full'>
            <View className='mt-[53]'/>
            {/* head section */}
            <Txt type='body4' content='준비한 문장을 시간 내에 또박또박 발음해주세요' color='gray_200'/>
            {/* content section */}
            <View className='mt-[28]'>
              <Txt type='title2' content={content} color='white'/>
            </View>
          </ScrollView>
        </View>
        {/* down section */}
        <View>
        {/* wave section */}
        <RCDWave
          volumeList={volumeList}
          isPlaying={isPlaying}
          recording={!!recording}
          isDone={isDone}
           />
          {/* timer section */}
          <View className='mt-[28]'/> 
          {/* <Timer/> */}
          <RCDTimer 
          recording={recording} 
          isPaused={isPaused} 
          isDone={isDone}
          setIsDone={setIsDone} 
          stop={stopRecording}
          type={type}
          />
          {/* button section */}
          <View className="w-full px-px mt-[40] mb-[70]">
          <RCDBtnBar
            record={startRecording}
            // pause={togglePauseRecording}
            play={playSound}
            upload={uploadRecording}
            isPlaying={isPlaying}
            // isPaused={isPaused}
            recording={recording}
            isDone={isDone}
            reflesh={refleshRCDStates}
            stop={stopRecording}
          />
        </View>
        </View>

        </View>
        </>
    ):(
      <>
        <AppBar
          title=''
          exitCallbackFn={() => {navigation.goBack()}}
          className="absolute top-[0] w-full"
        />
    <View className='flex-1 items-center justify-between mt-[65]'>
      
      {/* text section */}
    <View className='absolute top-[194] items-center'>
      {errType === 'bad'?<Notice1/>:<Notice2/>}
      <View className='mt-[43]'/>
      <Txt type='title2' 
      content={errType === 'bad'?'부적절한 표현이 감지되어\n녹음을 전송할 수 없어요':
        errType === 'noisy'?'주변 소음이 크게 들려서\n녹음을 전송할 수 없었어요':
        '서버에 문제가 생겨\n녹음을 전송할 수 없었어요'} 
      color='white' 
      align='center'/>
      <View className='mt-[25]'/>
      <Txt type='body4'
      content={errType === 'bad'?'적절한 언어로 다시 녹음해 주시겠어요?':
        errType === 'noisy'?'조용한 장소에서 다시 녹음해 주시겠어요?':
        '다시 시도해 주시겠어요?'} 
      color='gray_300' 
      align='center'/>
    </View>
    {/* button section */}
    <View className='px-px w-full absolute bottom-[50]'>
      <Button text='다시 녹음하기' 
      onPress={()=>{
        if(errType === 'bad'){
          navigation.navigate('Home')
        }else{
          navigation.goBack()
        }
      }} 
      disabled={false}/>
    </View>
    </View>
    </>
  )}
    </BG>
 
  )
}
export default RCDRecordScreen;
