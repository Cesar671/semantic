'use client';
import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useLanguage } from '../custom/languageSelectorContext';


const languageOptions = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  {code: 'pt', name:'Português', flag: 'pt'},
];

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const {lang, setLanguage} = useLanguage();
  const handleChange = (event) => {
    setSelectedLanguage(event.target.value);
    setLanguage(event.target.value);
  };
  return (
    <Box>
      <FormControl fullWidth size="small"
        sx={{
            width:"110px",
        }}
      >
        <InputLabel id="language-select-label">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageIcon fontSize="small" />
            <Typography variant="body2">{selectedLanguage}</Typography>
          </Box>
        </InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={selectedLanguage}
          label="Idioma"
          onChange={handleChange}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }
          }}
        >
          {languageOptions.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">{lang.name}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelector;