import { View ,TouchableOpacity} from "react-native";
import StarPNG from '../../components/atom/StarPNG'
import BG from '../../components/atom/BG'
import Txt from '../../components/atom/Txt'
import ShadowView from '../../components/atom/ShadowView'
import BackIcon from '../../../assets/svgs/Back.svg'
import { useNavigation, NavigationProp, RouteProp } from "@react-navigation/native";
import { HomeStackParamList } from "../../types/HomeStackParamList";
import { getTopText } from "../../libs/apis/RCDApis/getTopText";
import { useEffect, useState } from "react";
import { postAskGPT,PostAskGPTResponse } from "../../libs/apis/RCDApis/postAskGPT";
import { RCD } from "../../libs/apis/RCDApis/getRCDList";
import AppBar from "../../components/atom/AppBar";
import { ActivityIndicator } from 'react-native'

const SelectButton = ({head,sub,gpt,alarmId,item,type}:{head:string,sub:string,gpt:boolean,alarmId:number,item:RCD,type:'DAILY'|'COMFORT'}) => {
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
                    <Txt type='title4' content={head} color='primary' />
                    <View className='mt-[5]'/>
                    <Txt type='body4' content={sub} color='gray_200' />
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
    console.log(item)
    const [subTitle,setSubTitle]=useState<string>('')
    const [alarmId,setAlarmId] = useState<number>(0);
    useEffect(()=>{
        getTopText(item.categoryId).then((res)=>{
            setSubTitle(res.title);
            setAlarmId(res.alarmId);
        })
    },[])
    return (
        <BG type='solid'>
             <AppBar
          title='녹음 내용 작성'
          goBackCallbackFn={() => {navigation.goBack()}}
          className="absolute top-[0] w-full"
        />
            <View className='flex-1 px-px mt-[100] pt-[52] items-center'>
                <StarPNG />
                <View className='mt-[29]  mb-[52]  items-center'>
                    <Txt type='title2' content={item.title} color='white' align='center'/>
                    <View className='mt-[19]'>
                        <Txt type='body3' content={subTitle} color='gray_300' align='center' />
                    </View>
                </View>
                <SelectButton head='준비된 문장 읽기' sub='제시되는 문장을 수정하고 녹음하기' gpt={true} alarmId={alarmId} item={item} type={type}/>
                <SelectButton head='직접 작성하기' sub='하고싶은 말을 직접 작성하고 녹음하기' gpt={false} alarmId={alarmId} item={item} type={type}/>
            </View>
        </BG>
    )
}

export default RCDSelectText;