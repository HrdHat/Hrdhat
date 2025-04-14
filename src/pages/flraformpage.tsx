import FlraChecklist from "../components/flrachecklist";
import GeneralInformation from "../components/generalinformation";
import PPEPlatformInspection from "../components/ppeplatforminspection";
import THCModule from "../components/thcmodule";

const FLRAFormPage = () => {
  return (
    <div>
      <GeneralInformation />
      <FlraChecklist />
      <PPEPlatformInspection />
      <THCModule />
    </div>
  );
};

export default FLRAFormPage;
