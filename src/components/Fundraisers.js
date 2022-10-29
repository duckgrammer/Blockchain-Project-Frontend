import React from "react";
import { useEffect, useState } from 'react';

import {Container, ProgressBar} from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Donate from '../pages/Donate.js';
import Modal from 'react-modal';
//import './fundraisers.css';


const Fundraisers = ({i, contract, address, havebutton}) => {
    const [currProject, setCurrProject] = useState(null);

    //Project Details
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [currAmount, setCurrAmount] = useState(0);
    const [goalAmount, setGoalAmount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [claimed, setClaimed] = useState(false);

    const closeModal = () => {
        setIsOpen(false);
    }

    const FundMePage = () => {
        setIsOpen(true);
    }

    const getProject = async () => { 
        const res = await contract.methods.getProjectDetails(i).call();
        console.log(res);
        setCurrProject(res);
    }

    const button = () => {
        if (havebutton) {
            return (<Button variant="primary" onClick={FundMePage}>{timeLeft < 1 ? "View Details" : "Fund Me"}</Button>);
        }
        return null;
    }

    const status = () => {
        if (timeLeft < 1) {
            if (claimed) {
                return (<span style={{marginLeft: "1rem"}} className="badge bg-secondary">Closed</span>);
            }
            return (<span style={{marginLeft: "1rem"}} className="badge bg-warning text-dark">Unclaimed</span>);
        }
        return (<span style={{marginLeft: "1rem"}} className="badge text-bg-success">Active</span>);
    }

    function getTime() {
        const day = Math.floor(timeLeft / (60 * 60 * 24));
        const hour = Math.floor(timeLeft / (60 * 60) - day * 24);
        const min = Math.floor(timeLeft / 60 - day * 60 * 24 - hour * 60);

        if (timeLeft < 1) {
            return "Project has ended!";
        }
        if (timeLeft < 60) {
            return "Less than a minute remaining!";
        }
        return (day === 0 ? "" : (day + (day === 1 ? " day " : " days "))) + (hour === 0 ? "" : hour + "h ") + (min === 0 ? "" : min + "min ") + "remaining";
    }

    useEffect(() => {
        //console.log(i);
        getProject();
    }, []);

    useEffect(() => {
        if(currProject !== null){
            setName(currProject.name);
            setDescription(currProject.description);
            setCurrAmount(currProject.currentAmt);
            setGoalAmount(currProject.goalAmt);
            setTimeLeft(currProject.timeLeft);
            setClaimed(currProject.claimed);
        }
    }, [currProject]);

  return (
    <div>
        {currProject ===  null ? null :
            <Card style={{backgroundColor: "#384455"}}>
                <div style={{fontSize: "large", fontStyle: "oblique"}} className="card-header">
                    {name}
                    {status()}
                </div>
                <Card.Body>
                    <Card.Subtitle className="mb-2 text-muted">{getTime()}</Card.Subtitle>
                    <Card.Text>{description}</Card.Text>
                    <ProgressBar animated style={{marginBottom: "20px"}} now={((currAmount/(10**18))/goalAmount)*100} label={`${(currAmount/goalAmount)*100}%`}/>
                    <Card.Subtitle className="mb-2 text-info">{currAmount/(10**18)} / {goalAmount/(10**0)} Ether Raised</Card.Subtitle>
                    {button()}
                </Card.Body>
            </Card>
        }

        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            ariaHideApp={false}
            contentLabel="Example Modal"
        >
            <Donate
                address={address}
                id={i}
                name={name}
                description={description}
                currAmount={currAmount}
                goalAmount={goalAmount}
                timeLeft={timeLeft}
                contract={contract}
            />
        </Modal>
    </div>
    
);
}

export default Fundraisers;