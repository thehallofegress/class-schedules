export const saveData = async <T extends object>(
    fileName: string,
    data: T,
    setState: (data: T) => void,
    setLastUpdated: (time: string) => void
  ) => {
    try {
      const updatedData = {
        ...data,
        lastUpdated: new Date().toISOString(), // Ensures lastUpdated is added
      };
  
      const response = await fetch("/api/saveJson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, data: updatedData }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save ${fileName}`);
      }
  
      setState(updatedData);
      setLastUpdated(updatedData.lastUpdated);
    } catch (error) {
      console.error(`Error saving ${fileName}:`, error);
      alert(`Failed to save ${fileName}. Please try again.`);
    }
  };
  