import './address-validation.css';
import { useEffect, useState, type ChangeEvent } from 'react';
import {Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography, type SelectChangeEvent} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { IStreetCollection } from '../_models/street-collection';
import { IStreetNumber, IStreetNumberCollection } from '../_models/street-number-collection';
import { NORDIC_COUNTRIES } from '../helpers';
import { loadData } from '../requestUtils';

export function AddressValidation() {
  const [country, setCountry] = useState<string>('NO');
  const [street, setStreet] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [streetNo, setStreetNo] = useState<number | null>(null);
  const [postalCode, setPostalCode] = useState<string>('');

  const [streetCollection, setStreetCollection] = useState<IStreetCollection | null>(null);
  const [streetNumberCollection, setStreetNumberCollection] = useState<IStreetNumberCollection | null>(null);
  const [streetNumberObject, setStreetNumberObject] = useState<IStreetNumber | false | undefined>(undefined);

  // --- Effects --------------------------------------------------------------

  useEffect(() => {
    if (!street.trim()) {
      setStreetCollection(null);
      setSelectedCity('');
      return;
    }
    const timer = setTimeout(() => {
      fetchStreetCollection();
    }, 2000);
      return () => clearTimeout(timer); // cancels if user keeps typing
  }, [street, country]);

  useEffect(() => {
    setStreetNumberObject(undefined);
    fetchStreetNumberCollection();
    return;
  }, [selectedCity]);

  // Auto-pick first option in list
  useEffect(() => {
    const firstCityInSelect = streetCollection?.streets?.[0]?.city ?? '';
    if (!streetCollection?.streets?.length) {
      setSelectedCity('');
    } else if (!selectedCity && firstCityInSelect) {
      setSelectedCity(firstCityInSelect);
    }
  }, [streetCollection?.streets, selectedCity]);


  // --- Functions --------------------------------------------------------------

  // const clearValidation = () => setStreetNumberObject(undefined);

  const handleCountryChange = (e: SelectChangeEvent<string>) => {
    setCountry(e.target.value);

    setStreet('');
    setSelectedCity('');
    setStreetNo(null);
    setPostalCode('');

    setStreetCollection(null);
    setStreetNumberCollection(null);
    setStreetNumberObject(undefined);
  };

  const handleStreetChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStreet(e.target.value);
  };

  const handleSelectedCityChange = (e: SelectChangeEvent<string>) => {
    setSelectedCity(e.target.value);
  };

  const handleStreetNoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStreetNo(Number(e.target.value));
    setStreetNumberObject(undefined);
  };

  const handlePostalCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPostalCode(e.target.value);
    setStreetNumberObject(undefined);
  };

  const fetchStreetCollection = async () => {
    try {
      const data: IStreetCollection = await loadData(`https://staging-ws.di.no/ws/json/addressHelper/v-2/${country}/streetSearch/${encodeURIComponent(street)}`);
      setStreetCollection(data);
      setSelectedCity('');
    } catch(e) {
      console.error('StreetSearch failed:', e);
    }
  };
    
  const fetchStreetNumberCollection = async () => {
    if(!selectedCity) return;
    
    const cityStreetIds = (streetCollection?.streets ?? [])
      .filter(s => s.city === selectedCity)
      .map(s => s.streetIds ?? []);

    try {
      const data: IStreetNumberCollection = await loadData(`https://staging-ws.di.no/ws/json/addressHelper/v-2/${country}/streetNumberSearch/${cityStreetIds.join(',')}`);
      setStreetNumberCollection(data);
    } catch (e) {
      console.error('StreetNumberSearch failed:', e);
    }
  };

  const missingFields = (): boolean => {
    return (street && streetCollection && streetNo && postalCode) ? false : true;
  };

  const handleValidate = () => {
    const object = streetNumberCollection?.streetNumbers?.find(
      s => s.streetNo === streetNo && s.postalCode === postalCode
    );
    setStreetNumberObject(object ?? false);
  };


  // --- Render ----------------------------------------------------------------

  return (
    <Paper elevation={3} className="addressValidationPaper">
      <Typography variant="h6" gutterBottom>
        Address Validation
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <FormControl>
          <InputLabel>Country</InputLabel>
          <Select
            label="Country"
            value={country}
            onChange={handleCountryChange}
            fullWidth
          >
            <MenuItem value='' disabled>
              <em>Please select a country...</em>
            </MenuItem>
            {NORDIC_COUNTRIES.map((c) => (
              <MenuItem key={c.code} value={c.code}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Street"
          value={street || ''}
          onChange={handleStreetChange}
          fullWidth
          helperText="Wait 2 seconds after you last typed something."
        />

        <FormControl>
          <InputLabel>City</InputLabel>
          <Select
            label="City"
            value={selectedCity || ''}
            onChange={handleSelectedCityChange}
            disabled={!streetCollection?.streets?.length}
            fullWidth
            >
              <MenuItem value={selectedCity} disabled>
                <em>Please select a city...</em>
              </MenuItem>
							{streetCollection?.streets
								?.filter((street, index, allStreets) =>
										allStreets.findIndex(otherStreet => otherStreet.city === street.city) === index
								)
								.map((street, index) => (
									<MenuItem key={index} value={street.city}>
										{street.city}
									</MenuItem>
								))
							}
          </Select>
        </FormControl>

        <TextField 
          label="Street Number" 
          value={streetNo || ''}
          onChange={handleStreetNoChange}
          fullWidth 
        />

        <TextField 
          label="Postal Code" 
          value={postalCode || ''}
          onChange={handlePostalCodeChange}
          fullWidth 
        />

        <Button 
          color='secondary'
          variant="outlined" 
          size='large'
          className='mb-3'
          onClick={handleValidate}
          disabled={missingFields()}
          endIcon={(streetNumberObject === undefined) ? '' : 
            (!missingFields() && streetNumberObject ? <DoneIcon className="icon-success"  /> : <ErrorOutlineIcon className="icon-error" />)}
        >
          Validate
        </Button>
      </Box>

      <Box>
        {(!missingFields() && streetNumberObject) && (
          <>
            <div>Latitude: {streetNumberObject.latitude}</div>
            <div>Longitude: {streetNumberObject.longitude}</div>
          </>
        )}
      </Box>
     
    </Paper>
  );
}

export default AddressValidation;