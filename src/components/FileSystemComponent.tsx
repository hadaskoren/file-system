import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import HierarchicalComponent from "./HierarchicalComponent";
import { loadChildren, FileItem } from "../utils/fetchData";

const LOCAL_STORAGE_KEY = "fileSystemState";

function FileSystemComponent() {
  const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
  const initialState: FileItem[] = savedState ? JSON.parse(savedState) : [{ id: "root", label: "Root", type: "directory", children: [] }];
  const [data, setData] = useState<FileItem[]>(initialState);

  const saveState = (expandedIds: Set<string>) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...expandedIds]));
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  return (
    <Box
      component="section"
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ bgcolor: "white", minWidth: "550px", maxHeight: "80vh", overflow: "auto" }}
    >
      <HierarchicalComponent data={data} setData={setData} loadChildren={loadChildren} saveState={saveState}/>
    </Box>
  );
}

export default FileSystemComponent;
