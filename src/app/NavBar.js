'use client'

import { usePathname } from 'next/navigation'
import { Box, Button } from '@mui/material';
import Link from 'next/link';
import { checkLoggedIn } from "@/lib/auth";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
    </Box>
  );
}