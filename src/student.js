import {useState, useEffect} from 'react'

const Student = ({studentData,mentorData,getStudentsData,getMentorsData}) =>{
    const [name,setName] = useState("")
    const [selectVal, setSelectVal] = useState("Assign Mentor")

    const [mentorIdList, setMentorIdList] = useState([])

    useEffect(()=>{
        getStudentsData()
        getMentorsData()
    }, [])

    useEffect(()=>{
        const idList = []
        mentorData.forEach((data)=>{ idList.push(data.id) })
        setMentorIdList(idList)
    },[mentorData])

    const addStudent = async (e) =>{
        e.preventDefault();
        if(name!==""){
            var res = await fetch(`https://student-mentor-mongo-api.herokuapp.com/api/student`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name})
            })
            var resData = await res.json()
            if(resData.message = "Added 1 entry"){
                getStudentsData()
                setName("")
            }
        }
    }

    const handleMentorSelect = async (e, idx) =>{
        const mentorId = e.target.value
        const res = await fetch(`https://student-mentor-mongo-api.herokuapp.com/api/student/${idx+1}`,{
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({mentorId})
        })
        const resData = await res.json()
        if(resData.message='Mentor assigned to Student and Student added to mentor'){
            getStudentsData()
            getMentorsData()
            e.target.value = "Assign Mentor"
        }
    }

    const handleStudentDelete = async (idx) =>{
        const res = await fetch(`https://student-mentor-mongo-api.herokuapp.com/api/student/${idx+1}`,{
            method: "DELETE"})
        const resData = await res.json()
        if(resData.message="Delete Success"){
            getStudentsData()
            getMentorsData()
        }
    }

    return(
        <div className="student mb-4">
            <h4> Add Student </h4>
            <form className="form" onSubmit={(e)=>addStudent(e)}>
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Student Name" value={name} onChange={(e)=>(setName(e.target.value))}/>
                </div>
                <button type="submit" className="btn btn-primary mb-2"> Add </button>
            </form>
            <table className="table mt-4 table-responsive-md">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Student ID</th>
                    <th scope="col">Mentor ID</th>
                    <th scope="col"> Options </th>
                </tr>
            </thead>
            <tbody>
                {
                    studentData.map((student,idx)=>(
                        <tr key={idx}>
                            <td> {idx+1} </td>
                            <td> {student.name} </td>
                            <td> {student.id} </td>
                            <td> {student.mentorId || '-'}  </td>
                            <td className="options"> <select className="form-control" onChange={(e)=>handleMentorSelect(e,idx)}>
                                     <option value="Assign Mentor">Assign Mentor</option>
                                     {mentorIdList.map((mentId,idx)=>(
                                         <option key={idx} value={mentId}> {mentId} </option>
                                     ))}
                                </select> 
                                <span className="fas fa-trash" onClick={()=>handleStudentDelete(idx)}></span>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        </div>
    )
}

export default Student