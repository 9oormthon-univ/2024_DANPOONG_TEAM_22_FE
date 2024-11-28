import {View, TouchableOpacity} from 'react-native';
import StarPNG from '../../components/atom/StarPNG';
import BG from '../../components/atom/BG';
import Txt from '../../components/atom/Txt';
import ShadowView from '../../components/atom/ShadowView';
import BackIcon from '../../../assets/svgs/Back.svg';
import {
  useNavigation,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';
import {HomeStackParamList} from '../../types/HomeStackParamList';
import {getTopText} from '../../libs/apis/RCDApis/getTopText';
import {useEffect, useState} from 'react';
import {
  postAskGPT,
  PostAskGPTResponse,
} from '../../libs/apis/RCDApis/postAskGPT';
import {RCD} from '../../libs/apis/RCDApis/getRCDList';
import AppBar from '../../components/atom/AppBar';
import {ActivityIndicator} from 'react-native';

type SelectButtonProps = {
    head:string,
    sub:string,
    gpt:boolean,
    alarmId:number,
    item:RCD,
    type:'DAILY'|'COMFORT'
}

const SelectButton = ({head,sub,gpt,alarmId,item,type}:SelectButtonProps) => {
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>()
    const [isLoading,setIsLoading] = useState(false)
    const gptApiHandler=async()=>{
        setIsLoading(true);
        try{
            if(gpt){
                console.log('alarmId:',alarmId)
                const res = await postAskGPT(alarmId)
                console.log(res)
                navigation.navigate('RCDText',{item:item,gptRes:res,alarmId,type});
            }
            else navigation.navigate('RCDText',{item:item,gptRes:null,alarmId,type});
        }catch(e){
            console.log('err:',e)
        }finally{
            setIsLoading(false);
        }
    }
    return (
        <TouchableOpacity onPress={gptApiHandler} className='w-full h-[133] mb-[20]'>
            <ShadowView>
              <View className='pl-[33] pr-[20] py-[37] flex-row justify-between items-center'>

                <View>
                    <Txt type="title4" text={head} className="text-yellowPrimary" />
                    <View className="mt-[5]" />
                    <Txt type="body4" text={sub} className="text-gray200" />
                </View>
                {isLoading && gpt ? <ActivityIndicator size="small" color="#fafafa" /> : <BackIcon />}
                </View>
            </ShadowView>
        </TouchableOpacity>
    )
}
const RCDSelectText = ({route}:{route:RouteProp<HomeStackParamList,'RCDSelectText'>}) => {
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>()
    const {item,type} = route.params
    const [subTitle,setSubTitle]=useState<string>('')
    const [alarmId,setAlarmId] = useState<number>(0);
    useEffect(()=>{
        const getTopTextHandler = async()=>{
            const res = await getTopText(item.alarmCategory);
            setSubTitle(res.title);
            setAlarmId(res.alarmId);
        }
        getTopTextHandler();
    },[])
    return (
        <BG type='solid'>
             <AppBar
          title='녹음 내용 작성'
          goBackCallbackFn={() => {navigation.goBack()}}
          className="absolute top-[0] w-full"
        />
      </View>
    </BG>
  );
};

export default RCDSelectText;
