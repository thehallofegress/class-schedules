import ClassScheduleComponent from "./ClassScheduleComponent";
import { EditProvider } from "./EditContext";

// Wrap the component with EditProvider
const ClassScheduleWrapper = () => (
    <EditProvider>
      <ClassScheduleComponent />
    </EditProvider>
  );
  
  export default ClassScheduleWrapper;
