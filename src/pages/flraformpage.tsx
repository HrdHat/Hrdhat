import FlraChecklist from "../components/flrachecklist";
import GeneralInformation from "../components/generalinformation";

const FLRAFormPage = () => {
  return (
    <div>
      <h2>FLRA Form</h2>
      <GeneralInformation />
      <FlraChecklist />
    </div>
  );
};

export default FLRAFormPage;
