'use client'
import Image from 'next/image'
import TextField from "@mui/material/TextField";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TuneIcon from '@mui/icons-material/Tune';
import { Chip, Stack } from '@mui/material';
import { useState } from 'react';


export default function Home() {
  const [tags, setTags] = useState([
    { key: 'tag1', label: 'Catering', selected: false },
    { key: 'tag2', label: 'Venue', selected: false },
    { key: 'tag3', label: 'Entertainment', selected: false },
    { key: 'tag4', label: 'Production', selected: false },
    { key: 'tag5', label: 'Decoration', selected: false },
    // Add more tags as needed
  ]);

  const handleTagClick = (tagKey) => {
    const newTags = tags.map(tag => {
      if (tag.key === tagKey) {
        return { ...tag, selected: !tag.selected };
      }
      return tag;
    });
    setTags(newTags);
  };
  return (
    <>
    <Box sx={{backgroundImage: `url('https://images.unsplash.com/photo-1546449982-a01eedcc37c0?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFydHklMjBsaWdodHxlbnwwfHwwfHx8MA%3D%3D')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition:'center',
              display: 'flex', width: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center', height: 300, margin: 0, zIndex: 0}}>
      <Box  sx={{ display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent:"center", borderRadius: 50, borderColor: 'gray', 
                  borderWidth: 1, borderStyle: 'groove', width: .5, bgcolor: 'white'}}>
      <InputBase
        sx={{ ml: 1, flex: 1, justifyContent:'center' }}
        placeholder="Search for vendors..."
        inputProps={{ 'aria-label': 'search for vendors'}}
      />
        <IconButton aria-label="search">
          <SearchIcon />
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <IconButton aria-label="filter">
          <TuneIcon />
        </IconButton>
      </Box>-
    </Box>
    <Box>
    <Stack direction="row" spacing={1} sx={{ display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: 'center', 
        borderStyle: 'groove', borderWidth: 3, marginTop: 2, overflowX: 'auto', borderColor: 'white', color: 'white',padding: '10px',}}>
        {tags.map((tag) => (
          <Chip key={tag.key} label={tag.label} onClick={() => handleTagClick(tag.key)}
              variant={tag.selected ? 'filled' : 'outlined'}/>
        ))}
      </Stack>
    </Box>
    </>
  )
}
