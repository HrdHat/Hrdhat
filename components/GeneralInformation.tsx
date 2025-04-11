import React, { useState } from "react";
import { GeneralInfoData } from "../types/generalInfo";

const GeneralInformation: React.FC = () => {
  const [formData, setFormData] = useState<GeneralInfoData>({
    projectName: "",
    taskLocation: "",
    supervisorName: "",
    supervisorContact: "",
    todaysDate: "",
    crewMembers: "",
    todaysTask: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <section className="module-box">
      <span className="module-label">General Information</span>
      <div className="two-column-form">
        <label htmlFor="project-name">Project Name:</label>
        <input
          type="text"
          id="project-name"
          name="projectName"
          value={formData.projectName}
          onChange={handleChange}
          required
        />

        <label htmlFor="task-location">Task Location:</label>
        <input
          type="text"
          id="task-location"
          name="taskLocation"
          value={formData.taskLocation}
          onChange={handleChange}
          required
        />

        <label htmlFor="supervisor-name">Supervisor's Name:</label>
        <input
          type="text"
          id="supervisor-name"
          name="supervisorName"
          value={formData.supervisorName}
          onChange={handleChange}
          required
        />

        <label htmlFor="supervisor-contact">Supervisor's Contact #:</label>
        <input
          type="text"
          id="supervisor-contact"
          name="supervisorContact"
          value={formData.supervisorContact}
          onChange={handleChange}
          required
        />

        <label htmlFor="todays-date">Today's Date:</label>
        <input
          type="date"
          id="todays-date"
          name="todaysDate"
          value={formData.todaysDate}
          onChange={handleChange}
          required
        />

        <label htmlFor="crew-members"># of Crew Members:</label>
        <input
          type="text"
          id="crew-members"
          name="crewMembers"
          value={formData.crewMembers}
          onChange={handleChange}
          required
        />

        <label htmlFor="todays-task">Today's Task:</label>
        <input
          type="text"
          id="todays-task"
          name="todaysTask"
          value={formData.todaysTask}
          onChange={handleChange}
          required
        />

        <label htmlFor="start-time">Start Time:</label>
        <input
          type="time"
          id="start-time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />

        <div></div>
        <div></div>

        <label htmlFor="end-time">End Time:</label>
        <input
          type="time"
          id="end-time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
        />
      </div>
    </section>
  );
};

export default GeneralInformation;
