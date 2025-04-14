import FlraChecklist from "../components/flrachecklist";
import GeneralInformation from "../components/generalinformation";
import PPEPlatformInspection from "../components/ppeplatforminspection";

const FLRAFormPage = () => {
  return (
    <div>
      <GeneralInformation />
      <FlraChecklist />
      <PPEPlatformInspection />
    </div>
  );
};

export default FLRAFormPage;
