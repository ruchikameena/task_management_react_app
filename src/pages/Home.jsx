import './Home.css';
import profileVideo from '../assets/PROFILE.mp4';
import tasksVideo from '../assets/TASKS.mp4';
import workVideo from '../assets/WORK.mp4';
import boardVideo from '../assets/BOARD.mp4';

const Home = () => {
  return (
    <div className="home_main">
      <h2 className='home_main_h2'>👋 Welcome to the Dashboard!</h2>
      <p>Select a section from the sidebar to get started. 😎</p>
      <div className='home_main_div'>

        <div className='home_main_left'>

          <div className='home_main_left_sub' style={{ borderTop: '4px solid black', borderLeft: '4px solid black' }}>
            <video src={profileVideo} autoPlay loop muted playsInline className='home_video'></video>
            <div className="video_feature">
              <h2 style={{ marginBottom: '10px', color: '#02c37e' }}>Profile</h2>
              <ul>
                <li style={{ listStyle: 'none' }}>Users are able to see their personal information</li>
                <li style={{ listStyle: 'none', color: '#02c37e' }}>Streak tracker is present for consistency</li>
                <li style={{ listStyle: 'none' }}>Users can logout from here</li>
              </ul>
            </div>
          </div>

          <div className='home_main_right_sub' style={{ borderBottom: '4px solid black', borderLeft: '4px solid black' }}>
            <video src={boardVideo} autoPlay loop muted playsInline className='home_video'></video>
            <div className="video_feature">
              <h2 style={{ marginBottom: '10px', color: '#02c37e' }}>Board</h2>
              <ul>
                <li style={{ listStyle: 'none' }}>User can create the new tasks</li>
                <li style={{ listStyle: 'none', color: '#02c37e' }}>Tasks are automatically arranged in the respective columns</li>
                <li style={{ listStyle: 'none' }}>If either of due-date or person is not assigned tasks are arranged in to-do column</li>
                <li style={{ listStyle: 'none', color: '#02c37e' }}>If both the due-date and person assigned task arranged in on-going column</li>
                <li style={{ listStyle: 'none' }}>If tasks are submitted goes to completed column</li>
                <li style={{ listStyle: 'none', color: '#02c37e' }}>If due-date passed then move to pending column</li>
                <li style={{ listStyle: 'none' }}>User can submit the task irrespective of status</li>
                <li style={{ listStyle: 'none', color: '#02c37e' }}>User can change and see the due date, assigned person and can delete tasks at any stage using the edit button</li>
              </ul>
            </div>
          </div>

        </div>

        <div className='home_main_right'>

          <div className='home_main_left_sub' style={{ borderTop: '4px solid black', borderRight: '4px solid black' }}>
            <video src={tasksVideo} autoPlay loop muted playsInline className='home_video'></video>
            <div className="video_feature">
              <h2 style={{ marginBottom: '10px', color: '#02c37e' }}>Tasks</h2>
              <ul>
                <li style={{ listStyle: 'none' }}>User are able to see tasks assigned to them</li>
                <li style={{ listStyle: 'none', color: '#02c37e' }}>Each tasks have description, due date, submission link to attach</li>
                <li style={{ listStyle: 'none' }}>Only links like - drive,github,etc. are accepted.</li>
                <li style={{ listStyle: 'none', color: '#02c37e' }}>User can see the rejected message and able to submit again</li>
                <li style={{ listStyle: 'none' }}>Once submitted re-submission only possible if assigned person reject their task</li>
              </ul>
            </div>
          </div>

          <div className='home_main_right_sub' style={{ borderBottom: '4px solid black', borderRight: '4px solid black' }}>
            <video src={workVideo} autoPlay loop muted playsInline className='home_video'></video>
            <div className="video_feature">
              <h2 style={{ marginBottom: '10px', color: '#02c37e' }}>Work</h2>
              <ul>
                <li style={{ listStyle: 'none' }}>User are able to see the submitted task assigned by them</li>
                <li style={{ listStyle: 'none', color: '#02c37e' }}>They can reject and reassign the task, set new due date</li>
                <li style={{ listStyle: 'none' }}>User can attach message for the rejection of tasks</li>
                <li style={{ listStyle: 'none', color: '#02c37e' }}>Filter the tasks based on the selected date</li>
                <li style={{ listStyle: 'none' }}>Click on clear to remove the filter</li>
                <li style={{ listStyle: 'none', color: '#02c37e' }}>Sort the task based on the submission - fast and late submission </li>
              </ul>
            </div>
          </div>

        </div>
        
      </div>
    </div>
  );
};

export default Home;
