import React,{useState,useCallback,useRef} from 'react';
import {useFocusEffect} from 'expo-router';
import {View,Text,Pressable,Platform,ActivityIndicator,BackHandler,StyleSheet,Image} from 'react-native';
import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native-safe-area-context';
const SITE=process.env.EXPO_PUBLIC_WEB_URL||(Platform.OS==='android'?'http://10.0.2.2:3000':'http://localhost:3000');
export default function Storefront({path='/shop'}:{path?:string}){
 const webRef=useRef<WebView>(null),canGoBack=useRef(false);
 const [error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 useFocusEffect(useCallback(()=>{webRef.current?.injectJavaScript("window.dispatchEvent(new Event('codedfit:resume')); true;");const listener=BackHandler.addEventListener('hardwareBackPress',()=>{if(canGoBack.current){webRef.current?.goBack();return true;}return false;});return()=>listener.remove();},[]));
 const url=SITE.replace(/\/$/,'')+path;
 if(Platform.OS==='web')return <View style={{flex:1}}>{React.createElement('iframe',{src:url,title:'CODED FIT store',style:{width:'100%',height:'100%',border:0,background:'#fff'}})}</View>;
 return <SafeAreaView style={styles.shell} edges={['top']}>
 {error?<View style={styles.error}><Image source={require('../assets/coded-fit-logo.png')} style={{width:240,height:120}} resizeMode="contain" accessibilityLabel="CODED FIT"/><Text style={styles.title}>LET’S RECONNECT.</Text><Text style={styles.body}>{error}</Text><Pressable accessibilityRole="button" onPress={()=>{setError('');setAttempt(v=>v+1);}} style={styles.retry}><Text style={styles.retryText}>TRY AGAIN →</Text></Pressable>{__DEV__&&<Text style={styles.body}>For a physical phone, set EXPO_PUBLIC_WEB_URL to the running storefront’s LAN or HTTPS address.</Text>}</View>:<WebView ref={webRef} key={attempt} source={{uri:url}} style={styles.shell} javaScriptEnabled domStorageEnabled sharedCookiesEnabled startInLoadingState renderLoading={()=><View style={styles.loading}><ActivityIndicator color="#E5192B" size="large"/><Text style={styles.body}>Finding your next fit…</Text></View>} onNavigationStateChange={state=>{canGoBack.current=state.canGoBack;}} onError={()=>setError('We couldn’t reach the store. Check your connection and try again.')} onHttpError={e=>{if(e.nativeEvent.url===url&&e.nativeEvent.statusCode>=400)setError('The store is temporarily unavailable. Please try again shortly.');}} allowsInlineMediaPlayback mediaPlaybackRequiresUserAction={false}/>}
 </SafeAreaView>;
}
const styles=StyleSheet.create({shell:{flex:1,backgroundColor:'#fff'},error:{flex:1,justifyContent:'center',padding:28,gap:20},brand:{fontSize:30,fontWeight:'900',color:'#111'},title:{fontSize:24,fontWeight:'800',color:'#111'},body:{fontSize:13,lineHeight:21,color:'#666'},retry:{backgroundColor:'#E5192B',padding:18,alignItems:'center'},retryText:{color:'#fff',fontSize:12,fontWeight:'800'},loading:{position:'absolute',top:0,right:0,bottom:0,left:0,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',gap:18}});



