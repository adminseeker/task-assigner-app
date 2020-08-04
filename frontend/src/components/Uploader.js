import React,{useState} from "react"; 
import axios from "axios"; 
import { connect } from "react-redux";
import { getSubmissions } from "../actions/submissions";
import { getTeacherResources } from "../actions/rooms";
  
const Uploader = (props)=> { 
    const [selectedFile,setSelectedFile] = useState(null);
    const [description,setDescription] = useState("");
    
    const onFileChange = (e) => { 
        setSelectedFile(e.target.files[0]);
    }; 
    
    const onFileUpload = async () => { 
        const formData = new FormData();
        const config = {
            headers: {
                "description": description
            }
        } 
        formData.append( "file",selectedFile); 
       await axios.post("/api/upload/"+props.room_id, formData,config); 
       console.log("File Uploaded");
       if(props.isTeacher){
        props.dispatch(getTeacherResources(props.room_id));
      }else{
        props.dispatch(getSubmissions(props.room_id));
      }
       
       
    }; 
    const fileData = () => { 
        if (selectedFile) { 
            return ( 
            <div> 
              <h2>File Details:</h2> 
              <p>File Name: {selectedFile.name}</p> 
              <p>File Type: {selectedFile.type}</p> 
              <p> 
                Last Modified:{" "} 
                {selectedFile.lastModifiedDate.toDateString()} 
              </p> 
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
            <h3>Enter file description: </h3> 
            <input type="text" value={description} onChange={(e)=>(setDescription(e.target.value))}/><br /><br />
            <input type="file" onChange={onFileChange} /> 
            <button onClick={onFileUpload}> 
                Upload! 
            </button> 
        </div> 
        {fileData()} 
    </div> 
    ); 
} 
     
export default connect()(Uploader); 
