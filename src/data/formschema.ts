// src/formSchema.ts
// GeneralInfo field definition type

export interface GeneralInfoData {
  projectName: string;
  taskLocation: string;
  supervisorName: string;
  supervisorContact: string;
  todaysDate: string;
  crewMembers: string;
  todaysTask: string;
  startTime: string;
  endTime: string;
}

export interface FormField {
  name: keyof GeneralInfoData;
  label: string;
  type: "text" | "date" | "time";
}

// Centralized field array
export const generalInfoFields: FormField[] = [
  { name: "projectName", label: "Project Name", type: "text" },
  { name: "taskLocation", label: "Task Location", type: "text" },
  { name: "supervisorName", label: "Supervisor's Name", type: "text" },
  { name: "supervisorContact", label: "Supervisor's Contact #", type: "text" },
  { name: "todaysDate", label: "Today's Date", type: "date" },
  { name: "crewMembers", label: "# of Crew Members", type: "text" },
  { name: "todaysTask", label: "Today's Task", type: "text" },
  { name: "startTime", label: "Start Time", type: "time" },
  { name: "endTime", label: "End Time", type: "time" },
];

export const flraChecklistQuestions: string[] = [
  "Are you well-rested and fit for duty?",
  "Have you reviewed the work area for hazards?",
  "Do you have the required PPE for today?",
  "Is your equipment inspection up-to-date?",
  "Have you completed your FLRA / hazard assessment?",
  "Has all safety signage been installed and checked?",
  "Are you working alone today?",
  "Do you have all required permits for today’s tasks?",
  "Have all necessary barricades, signage, and barriers been installed and are in good condition?",
  "Do you have clear access to emergency exits and muster points?",
  "Are you trained and competent for your tasks today?",
  "Have you inspected your tools and equipment?",
  "Have you reviewed the control measures needed today?",
  "Have you reviewed your emergency procedures?",
  "Are all required permits in place (if applicable)?",
  "Have you communicated with your crew about today’s plan?",
  "Is there a need for spotters, barricades, or other special controls?",
  "Is the weather or environmental condition suitable for work?",
  "Do you know who the designated first aid attendant is today?",
  "Are you aware of any specific site notices or bulletins today?",
];
export const ppeItems = [
  "Hardhat",
  "Safety Vest",
  "Safety Glasses",
  "Fall Protection",
  "Coveralls",
  "Gloves",
  "Mask",
  "Respirator",
];

export const platformItems = [
  "Ladder",
  "Step Bench / Work Bench",
  "Sawhorses",
  "Baker Scaffold",
  "Scaffold",
  "Scissor Lift",
  "Boom Lift",
  "Swing Stage",
  "Hydro Lift",
];
