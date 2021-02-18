import {useEffect, useState} from 'react'

import Mentor from './mentor';
import Student from './student';
import './App.css';
import Navbar from './navbar';

function App() {
  const [studentData, setStudentData] = useState([])

  const [mentorData, setMentorData] = useState([])

  const [studSelectList,setStudSelectList] = useState([])

  const getStudentsData = async () =>{
        var res = await fetch(`https://student-mentor-mongo-api.herokuapp.com/api/students`)
        var resData = await res.json()
        setStudentData(resData)
  }

  const getMentorsData = async () =>{
      var res = await fetch(`https://student-mentor-mongo-api.herokuapp.com/api/mentors`)
      var resData = await res.json()
      setMentorData(resData)
  }

  useEffect(()=>{
    if(studentData.length!==0){
      let studsWithNoMentor = studentData.filter((stud)=>("mentorId" in stud === false)).map((stud)=>({label:stud.id, value:stud.id}))
      setStudSelectList(studsWithNoMentor)
    }
    
  },[mentorData,studentData])

  return (
    <>
    <Navbar />
    <div className="app">
      <Student studentData={studentData} mentorData={mentorData} getStudentsData={getStudentsData} getMentorsData={getMentorsData}  />
      <Mentor mentorData={mentorData} getMentorsData={getMentorsData} 
      getStudentsData={getStudentsData} studSelectList={studSelectList} setStudSelectList={setStudSelectList}/>
    </div>
    </>
  );
}

export default App;
