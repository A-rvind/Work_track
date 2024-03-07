import React, {useState, useEffect} from 'react';
import './App.css';
import {AiOutlineDelete, AiOutlineEdit} from 'react-icons/ai';
import {BsCheckLg} from 'react-icons/bs';

function Home () {
  const [isCompleteScreen, setIsCompleteScreen] = useState (false);
  const [alltasks, settasks] = useState ([]);
  const [newTitle, setNewTitle] = useState ('');
  const [newDescription, setNewDescription] = useState ('');
  const [completedtasks, setCompletedtasks] = useState ([]);
  const [currentEdit,setCurrentEdit] = useState("");
  const [currentEditedItem,setCurrentEditedItem] = useState("");

  const handleAddtask = () => {
    let newtaskItem = {
      title: newTitle,
      description: newDescription,
    };

    let updatedtaskArr = [...alltasks];
    updatedtaskArr.push (newtaskItem);
    settasks (updatedtaskArr);
    localStorage.setItem ('tasklist', JSON.stringify (updatedtaskArr));
  };

  const handleDeletetask = index => {
    let reducedtask = [...alltasks];
    reducedtask.splice (index,1);

    localStorage.setItem ('tasklist', JSON.stringify (reducedtask));
    settasks (reducedtask);
  };

  const handleComplete = index => {
    let now = new Date ();
    let dd = now.getDate ();
    let mm = now.getMonth () + 1;
    let yyyy = now.getFullYear ();
    let h = now.getHours ();
    let m = now.getMinutes ();
    let s = now.getSeconds ();
    let completedOn =
      dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s;

    let filteredItem = {
      ...alltasks[index],
      completedOn: completedOn,
    };

    let updatedCompletedArr = [...completedtasks];
    updatedCompletedArr.push (filteredItem);
    setCompletedtasks (updatedCompletedArr);
    handleDeletetask (index);
    localStorage.setItem (
      'completedtasks',
      JSON.stringify (updatedCompletedArr)
    );
  };

  const handleDeleteCompletedtask = index => {
    let reducedtask = [...completedtasks];
    reducedtask.splice (index);

    localStorage.setItem ('completedtasks', JSON.stringify (reducedtask));
    setCompletedtasks (reducedtask);
  };

  useEffect (() => {
    let savedtask = JSON.parse (localStorage.getItem ('tasklist'));
    let savedCompletedtask = JSON.parse (
      localStorage.getItem ('completedtasks')
    );
    if (savedtask) {
      settasks (savedtask);
    }

    if (savedCompletedtask) {
      setCompletedtasks (savedCompletedtask);
    }
  }, []);


  const handleEdit = (ind,item)=>{
    console.log(ind);
    setCurrentEdit(ind);
    setCurrentEditedItem(item);
  }

  const handleUpdateTitle = (value)=>{
    setCurrentEditedItem((prev)=>{
      return {...prev,title:value}
    })
  }

  const handleUpdateDescription = (value)=>{
    setCurrentEditedItem((prev)=>{
      return {...prev,description:value}
    })
  }

  const handleUpdatetask = ()=>{
      let newtask = [...alltasks];
      newtask[currentEdit] = currentEditedItem;
      settasks(newtask);
      setCurrentEdit("");
  }



  return (
    <div className="track">
      <h1>Track Your Work</h1>

      <div className="task-wrapper">
        <div className="task-input">
          <div className="task-input-item">
            <label>Header</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle (e.target.value)}
              placeholder="What's the task title?"
            />
          </div>
          <div className="task-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={e => setNewDescription (e.target.value)}
              placeholder="What's the task description?"
            />
          </div>
          <div className="task-input-item">
            <button
              type="button"
              onClick={handleAddtask}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>

        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompleteScreen === false && 'active'}`}
            onClick={() => setIsCompleteScreen (false)}
          >
            Work
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
            onClick={() => setIsCompleteScreen (true)}
          >
            Completed
          </button>
        </div>

        <div className="task-list">

          {isCompleteScreen === false &&
            alltasks.map ((item, index) => {
              if(currentEdit===index){
                 return(
                  <div className='edit__wrapper' key={index}>
                  <input placeholder='Updated Title' 
                  onChange={(e)=>handleUpdateTitle(e.target.value)} 
                  value={currentEditedItem.title}  />
                  <textarea placeholder='Updated Title' 
                  rows={4}
                  onChange={(e)=>handleUpdateDescription(e.target.value)} 
                  value={currentEditedItem.description}  />
                   <button
              type="button"
              onClick={handleUpdatetask}
              className="primaryBtn"
            >
              Update
            </button>
              </div> 
                 ) 
              }else{
                return (
                  <div className="task-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
  
                    <div>
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => handleDeletetask (index)}
                        title="Delete?"
                      />
                      <BsCheckLg
                        className="check-icon"
                        onClick={() => handleComplete (index)}
                        title="Complete?"
                      />
                      <AiOutlineEdit  className="check-icon"
                        onClick={() => handleEdit (index,item)}
                        title="Edit?" />
                    </div>
  
                  </div>
                );
              }
              
            })}

          {isCompleteScreen === true &&
            completedtasks.map ((item, index) => {
              return (
                <div className="task-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p><small>Completed on: {item.completedOn}</small></p>
                  </div>

                  <div>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleDeleteCompletedtask (index)}
                      title="Delete?"
                    />
                  </div>

                </div>
              );
            })}

        </div>
      </div>
    </div>
  );
}

export default Home;