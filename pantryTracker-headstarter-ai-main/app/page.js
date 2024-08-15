'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import Webcam from 'react-webcam';
import { firestore } from './firebase'; // Ensure this path is correct
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const classifyImage = async (imageSrc) => {
  // Simulate image classification
  // Replace this with an actual API call to GPT Vision or other LLM
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('classified-label');
    }, 1000);
  });
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const webcamRef = useRef(null);

  const updateInventory = async () => {
    try {
      const inventoryRef = collection(firestore, 'inventory');
      const snapshot = await getDocs(inventoryRef);
      const inventoryList = [];
      snapshot.forEach((doc) => {
        inventoryList.push({ name: doc.id, ...doc.data() });
      });
      setInventory(inventoryList);
    } catch (error) {
      console.error('Error fetching inventory: ', error);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const captureAndClassifyImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const label = await classifyImage(imageSrc);
    await addItem(label);
  };

  const addItem = async (item) => {
    try {
      const docRef = doc(firestore, 'inventory', item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }
      await updateInventory();
    } catch (error) {
      console.error('Error adding item: ', error);
    }
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(firestore, 'inventory', item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
        }
      }
      await updateInventory();
    } catch (error) {
      console.error('Error removing item: ', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400}
      />
      <Button variant="contained" onClick={captureAndClassifyImage}>
        Capture and Classify Image
      </Button>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
