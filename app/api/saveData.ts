import { TABLES } from "@/app/components/types";
import { supabase } from "@/app/api/supabaseClient";

// Helper to get table name from filename
const getTableName = (fileName: string): string => {
  // Extract the base name without path and extension
  const baseName = fileName.split('/').pop()?.split('.')[0];
  
  // Match to a table name or return the base name
  return baseName && TABLES[baseName as keyof typeof TABLES] 
    ? TABLES[baseName as keyof typeof TABLES] 
    : (baseName || fileName);
};

export const saveDataWithUpsert = async <T extends object>(
  fileName: string,
  data: T,
  setState: (data: T) => void,
  setLastUpdated: (time: string) => void,
  primaryKey: string = 'id', // Primary key for upsert
  onSuccess?: () => void
) => {
  try {
    const tableName = getTableName(fileName);
    
    const updatedData = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };

    console.log(`⬆️ Upserting data to Supabase table: ${tableName}`);

    // Upsert data (insert if not exists, update if exists)
    const { error } = await supabase
      .from(tableName)
      .upsert(updatedData, { 
        onConflict: primaryKey,
        ignoreDuplicates: false
      });

    if (error) {
      throw new Error(`Error upserting data: ${error.message}`);
    }

    console.log(`✅ Data upserted to Supabase table: ${tableName}`);

    // Update state locally
    setState(updatedData);
    setLastUpdated(updatedData.lastUpdated);

    if (onSuccess) onSuccess();
  } catch (error) {
    console.error(`❌ Error saving to ${fileName}:`, error);
    alert(`Failed to save ${fileName}. Please try again.`);
  }
};

