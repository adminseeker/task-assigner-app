import React, { useState } from "react";
import {joinStudent} from "../actions/auth";
import {connect} from "react-redux";
import GeneralModal from "./GeneralModal";

const Join = (props)=>{
    const [formData,setFormData] = useState({
        invite_id:"",
        error:""
    });
    const [showModal,setShowModal] = useState(false);
    const [ModalText,setModalText] = useState("");

    const {invite_id,error} = formData;

    const onChange = (e)=>{
        setFormData({...formData , [e.target.name]:e.target.value})
    }

    const onSubmit = async (e)=>{
        e.preventDefault();
        setShowModal(true);
        setModalText("Joining Classroom");
        const res = await props.dispatch(joinStudent({invite_id}));
        setShowModal(false); 
        if(String(res.msg)==="join successfull!"){
           props.history.push("/dashboard");
        }
        else{
            setShowModal(true);
            setModalText(res.msg);
            setInterval(()=>{
                setShowModal(false);
            },2000)
        }
    }

    return(
        <div>
            <GeneralModal 
                modal = {"login_modal"}
                loader_image={"51.gif"}
                modal__title = {"login_modal__title"}
                showModal={showModal} 
                text={ModalText}
            />
            <h1>Join Classroom</h1>
            {error && <h2>{error}</h2>}
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="invite_id">Invite Code:</label><br />
                    <input type="text" name="invite_id" value={invite_id} id="invite_id" onChange={onChange}/>
                </div>
                <br />
                <button type="submit">Join</button>
            </form>
        </div>
    )
}

const mapStateToProps = (state,props)=>({
    loading:state.auth.loading
})

export default connect(mapStateToProps)(Join);