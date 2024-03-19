import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import moment from 'moment';
import { useState ,useEffect } from 'react';
import { useForkRef } from '@mui/material';
import "moment/dist/locale/ar-dz"
moment.locale('ar');



export default  function MainContent() {

  
    //States 

    const [nextPrayerIndex,setNExtPrayerIndex] = useState(2);
    const [timings , setTimings] =useState({
            "Fajr": "05:21",
            "Dhuhr": "12:44",
            "Asr": "16:07",
            "Maghrib": "18:43",
            "Isha": "20:03",
    });

    const [remainingTime ,setRemainingTime] = useState("");

    const [footerText, setFooterText] = useState('created by elbara mouaffak');


    const [selectedCity, setSelectedCity] = useState({
      displayName : "باتنة ",
      apiName : "Batna",
    });

    const [today,setToday] = useState("");

    const availibleCity= [
      {
        displayName : "باتنة ",
        apiName : "Batna",
      },
      {
        displayName : "سطيف ",
        apiName : "Setif",
      },
      {
        displayName : "الجزائر ",
        apiName : "Alger",        
      },
      {
        displayName : "وهران ",
        apiName : "Oran",
      },
      {
        displayName : " خنشلة",
        apiName : "khenchela",
      },
    ];
    

    const prayersArray = [
      {key : "Fajr" , displayName : " الفجر "},
      {key : "Dhuhr" , displayName :" الظهر"},
      {key : "Asr" , displayName : " العصر"},
      {key : "Maghrib" , displayName : " المغرب"},
      {key : "Isha" , displayName : " العشاء"},
      
    ] ;
    
    const getTimings = async () => {
      console.log("callinge the api");
    const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity?country=DZ&city=${selectedCity.apiName}`
     );
    setTimings(response.data.data.timings);
    };

    useEffect(() =>{
        getTimings();
      },[selectedCity]);
 

    useEffect(() => {
      let intervel = setInterval(() => {
       console.log('calling timer') ;
        setupCountdonwTimer();
        },1000);

        const t = moment();
        setToday(t.format("Do MMMM YYYY, h:mm:ss a"));
          return () =>{
          clearInterval(intervel);
       };
    },[timings]);


    const setupCountdonwTimer = () => {
      const momentNow = moment ();

      let PrayerIndex = 2 ;

      if (
        momentNow.isAfter(moment(timings["Fajr"],"hh:mm")) && 
        momentNow.isBefore(moment(timings["Dhuhr"],"hh:mm"))
      ) {
        PrayerIndex = 1 ;
        console.log('next prayer is dhuhr') ;
      }else if (
        momentNow.isAfter(moment(timings["Dhuhr"],"hh:mm")) && 
        momentNow.isBefore(moment(timings["Asr"],"hh:mm"))
      ) {
        PrayerIndex = 2 ;

        console.log("next prayer is Asr");
      }else if (
        momentNow.isAfter(moment(timings["Asr"],"hh:mm")) && 
        momentNow.isBefore(moment(timings["Maghrib"],"hh:mm"))
      ) {
        PrayerIndex = 3 ;

        console.log("next prayer is maghrib");
      }else if (
          momentNow.isAfter(moment(timings["Maghrib"],"hh:mm")) && 
          momentNow.isBefore(moment(timings["IShA"],"hh:mm"))
      ) {
        PrayerIndex = 4 ;
      }else {
        PrayerIndex = 0 ;
      }


        setNExtPrayerIndex(PrayerIndex);

        const nextPrayerObject = prayersArray[PrayerIndex];
        const nextPrayerTime = timings[nextPrayerObject.key];
        const nextPrayerTimeMoment = moment(nextPrayerTime,"hh:mm");

        const remainingTime = moment(nextPrayerTime,"hh:mm").diff(momentNow);


        if(remainingTime<0){
          const middnightDiff = moment("23:59:59" , "hh:mm").diff(momentNow);
          const fajrtomiddnightDiff = nextPrayerTimeMoment.diff(
            moment("00:00:00" ,"hh:mm:ss")
          );

          const totaldeferance = middnightDiff + fajrtomiddnightDiff ;

          remainingTime = totaldeferance;
        }
        
        console.log(remainingTime);

       const durationRaiminingTime = moment.duration(remainingTime);

       setRemainingTime(
        `${durationRaiminingTime.seconds()} : 
        ${durationRaiminingTime.minutes()} : 
        ${durationRaiminingTime.hours()}`);
        console.log(
          "duration is : " , 
         durationRaiminingTime.hours(),
         durationRaiminingTime.minutes(),      
         durationRaiminingTime.seconds()
         );
      }; 
    const handlecityChange = (event) => {
      const cityObject = availibleCity.find((city) =>{
        return city.apiName == event.target.value;
      });
        console.log('the new value :' ,event.target.value);
        setSelectedCity(cityObject);
        
      };

  return (
  <>
    {/* top row*/}
     <Grid container >
        <Grid xs={6}>
            <div>
                <h2>{today}</h2>
                <h1>{selectedCity.displayName}</h1>
            </div>
        </Grid>

        <Grid xs={6}>
            <div>
                <h2> متبقي حتى صلاة 
                  {prayersArray[nextPrayerIndex].displayName}
                  </h2>

                <h1>{remainingTime}</h1>
            </div>
        </Grid>
     </Grid>
    {/*== top row ==*/}

    <Divider style={{ borderColor:'white' ,opacity:"0.1"}}/> 


{/* Prayer cards*/}
    <Stack 
    direction={'row'} 
    justifyContent={'space-around'} 
    style={{marginTop: "50px"}}>
        <Prayer 
        name="الفجر" 
        time={timings.Fajr} 
        image={"https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2"}/>
        
        <Prayer 
        name='الظهر' 
        time= {timings.Dhuhr} 
        image={"https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921"}/>
        
        <Prayer 
        name='العصر' 
        time= {timings.Asr} 
        image={"https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf"}/>
        
        <Prayer 
        name='المغرب' 
        time= {timings.Maghrib} 
        image={"https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5"}/>
        
        <Prayer 
        name='العشاء' 
        time= {timings.Isha}
        image={"https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d"}/>

        </Stack>  

{/* Prayer cards*/}

{/* Select city*/}
    <Stack 
    direction="row"
    justifyContent={'center'}
    style={{marginTop:"30px"}}
     >
    <FormControl 
    style={{width :"20%" }}>
        <InputLabel id="demo-simple-select-label" >
                <span 
                style={{color :"white"}}>city
                </span>       
                </InputLabel>
        <Select 
          style={{color :"white"}}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          //value={age}
          label="Age"
          onChange={handlecityChange}
        >
          {availibleCity.map((city)=> {
            return(
                <MenuItem value={city.apiName} 
                 key={city.apiName}>
                      {city.displayName}
                </MenuItem>
            );
          })}
        </Select>
      </FormControl>
         </Stack>
         <p>{footerText}</p>

  </>
  );
}
