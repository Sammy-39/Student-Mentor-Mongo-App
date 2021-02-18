import {useEffect, useState} from 'react'
import MultiSelect from "react-multi-select-component";

const Mentor = ({mentorData,getMentorsData,getStudentsData,studSelectList}) =>{
    
    const [name,setName] = useState("")

    useEffect(()=>{
        getMentorsData()
    },[])

    const addMentor = async (e) =>{
        e.preventDefault();
            if(name!==""){
                var res = await fetch(`https://student-mentor-mongo-api.herokuapp.com/api/mentor`,{
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({name})
                })
                var resData = await res.json()
                if(resData.message = "Added 1 entry"){
                    getMentorsData()
                    getStudentsData()
                    setName("")
                }
            }
        }

    const handleStudsSelect = async (list,idx) =>{
        if(list.length!==0){
            let studList = list.map((item)=>item.value)
            var res = await fetch(`https://student-mentor-mongo-api.herokuapp.com/api/mentor/${idx+1}`,{
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({"studsId":studList})
            })
            var resData = await res.json()
            if(resData.message = "Patch Success"){
                getMentorsData()
                getStudentsData()
            }  
        }
    }

    return(
        <div className="mentor">
            <h4> Add Mentor </h4>
            <form className="form" onSubmit={(e)=>addMentor(e)}>
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Mentor Name" value={name} onChange={(e)=>(setName(e.target.value))}/>
                </div>
                <button type="submit" className="btn btn-primary mb-2"> Add </button>
            </form>
            <table className="table mt-4 table-responsive-md">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Mentor ID</th>
                    <th scope="col">Students ID</th>
                    <th scope="col">Options</th>
                </tr>
            </thead>
            <tbody>
                {
                    mentorData.map((mentor,idx)=>(
                        <tr key={idx}>
                            <td> {idx+1} </td>
                            <td> {mentor.name} </td>
                            <td> {mentor.id} </td>
                            <td> {(mentor.studsId && mentor.studsId.join(", ")) || '-'}  </td>
                            <td className="options"> 
                            <MultiSelect
                                options={studSelectList}
                                onChange={(list)=>handleStudsSelect(list,idx)}
                                hasSelectAll = {false}
                                disableSearch = {true}
                                overrideStrings = {{"selectSomeItems": "Assign Students"}}
                            />
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        </div>
    )
}

export default Mentor