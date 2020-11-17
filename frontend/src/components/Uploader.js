import React,{useState} from "react"; 
import axios from "axios"; 
import { connect } from "react-redux";
import { getSubmissions, getSubmissionsByTeacher } from "../actions/submissions";
import { getTeacherResources } from "../actions/rooms";
  
const Uploader = (props)=> { 
    const [selectedFile,setSelectedFile] = useState(null);
    const [description,setDescription] = useState("");
    
    const onFileChange = (e) => { 
        setSelectedFile(e.target.files[0]);
    }; 
    
    const onFileUpload = async () => { 
        const formData = new FormData();
        formData.append( "file",selectedFile);
        console.log(formData)
        if(!selectedFile){
          alert("choose file!");
        }else{
          if(description==""){
            alert("Enter Description!");
          }else{
            
            console.log("File Uploaded");
            if(props.isTeacher){
              let config = {
                headers: {
                    "description": description
                }
            }
            await axios.post("/api/upload/"+props.room_id, formData,config); 
            await props.dispatch(getTeacherResources(props.room_id));
            }else{
              let config = {
                headers: {
                    "description": description,
                    "resource_id": props.resource_id
                }
            }
              await axios.post("/api/upload/"+props.room_id, formData,config);
              await props.dispatch(getSubmissionsByTeacher(props.room_id,props.resource_id));
            }
          }
        }
    }; 
    const fileData = () => { 
        if (selectedFile) { 
            return ( 
            <div> 
              <h2>File Details:</h2> 
              <p>File Name: {selectedFile.name}</p> 
              <p>File Type: {selectedFile.type}</p> 
            </div> 
          ); 
        } else { 
          return ( 
            <div> 
              <br /> 
              <h4>Choose before Pressing the Upload button</h4> 
            </div> 
          ); 
        } 
    }; 
    return ( 
    <div> 
        <div>
            <br />
            <input type="file" onChange={onFileChange} /> 
            <input type="text" value={description} placeholder="Enter description" onChange={(e)=>(setDescription(e.target.value))}/><br /><br />
            <button onClick={onFileUpload}> 
                Upload! 
            </button> 
        </div> 
        {fileData()} 
    </div> 
    ); 
} 
     
export default connect()(Uploader); 
