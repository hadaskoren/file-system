import { useState, useEffect } from "react";
import { Collapse, ListItem, ListItemText, ListItemIcon, IconButton, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CircularProgress from '@mui/material/CircularProgress';

export interface DataItem {
  id: string;
  label: string;
  children?: DataItem[];
  isLoading?: boolean;
}

interface HierarchicalComponentProps<T extends DataItem> {
  data: T[];
  setData: (newData: T[]) => void;
  saveState: (expandedIds: Set<string>) => void
  loadChildren: (parentId: string) => Promise<T[]>;
}

function HierarchicalComponent<T extends DataItem>({ data, setData, loadChildren, saveState }: HierarchicalComponentProps<T>) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const getAllParentIds = (data) => {
    let ids = new Set();
    const traverse = (nodes) => {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          ids.add(node.id);
          traverse(node.children);
        }
      });
    };
    traverse(data);
    return ids;
  };

  useEffect(() => {
    setExpandedIds(getAllParentIds(data));
  }, [data]);

  const removeItem = (item) => {
    return { ...item, children: [] };
  };

  const handleExpand = async (itemId: string) => {
    const newExpandedIds = new Set(expandedIds);
    if (newExpandedIds.has(itemId)) {
      newExpandedIds.delete(itemId);

      const updateItems = (items: T[], id: string, updateFn: (item: T) => T): T[] => {
        return items.map(item => {
          if (item.id === id) {
            return updateFn(item);
          } else if (item.children) {
            return { ...item, children: updateItems(item.children as T[], id, updateFn) };
          }
          return item;
        });
      };

      const updatedData = updateItems(data, itemId, removeItem);
      setData(updatedData);
    } else {
      newExpandedIds.add(itemId);

      const updateItems = (items: T[], id: string, updateFn: (item: T) => T): T[] => {
        return items.map(item => {
          if (item.id === id) {
            return updateFn(item);
          } else if (item.children) {
            return { ...item, children: updateItems(item.children as T[], id, updateFn) };
          }
          return item;
        });
      };

      setData(prevItems => updateItems(prevItems, itemId, item => ({ ...item, isLoading: true })));

      const children = await loadChildren(itemId);

      setData(prevItems => updateItems(prevItems, itemId, item => ({ ...item, children, isLoading: false })));
    }
    saveState([...newExpandedIds]);
    setExpandedIds([...newExpandedIds]);
  };

  const renderItems = (items: T[], level: number = 0): React.ReactNode => {
    return items.map((item) => (
      <Box key={item.id} sx={{width: '100%', justifyContent: "space-between"}}>
        <ListItem
          button sx={{justifyContent: "space-between", padding: '10px'}}
          onClick={() => handleExpand(item.id)} style={{ paddingLeft: `${(level + 1) * 20}px` }}>
          <Box sx={{display: "flex", alignItems: 'center'}}>
            <ListItemIcon sx={{ minWidth: '24px',
              backgroundColor: `${item.type === "png" ? '#CF1A5B' : item.type === "jpg" ? '#F6B439' : item.type === "doc" ? '#5933A3' : '#259B81'}`,
              borderRadius: '50%',
              padding: '10px',
            }}>
              {item.type === 'directory' ? <FolderIcon /> : <InsertDriveFileIcon style={{ color: 'white' }}/>}
            </ListItemIcon>
            <Box sx={{flexDirection: "column", marginLeft: '20px'}}>
              <ListItemText primary={item.label}  />
              <ListItemText secondary={item.size} secondaryTypographyProps={{ variant: 'caption', lineHeight: '0.66' }} />
            </Box>
          </Box>
          {item.isLoading ? (
            <CircularProgress size={20} />
          ) : (
            item.children && (
              <IconButton size="small">
                {new Set(expandedIds).has(item.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )
          )}
        </ListItem>
        <Collapse in={new Set(expandedIds).has(item.id)} unmountOnExit>
          <div>
            {item.children && renderItems(item.children, level + 1)}
          </div>
        </Collapse>
      </Box>
    ));
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%'}}>
      {renderItems(data)}
    </Box>
  );
}

export default HierarchicalComponent;
