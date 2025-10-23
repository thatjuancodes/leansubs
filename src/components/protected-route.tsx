import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/auth.context'
import { Box, Spinner, Stack, Text } from '@chakra-ui/react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Box 
        minH="100vh" 
        bg="light" 
        _dark={{ bg: "dark" }} 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        <Stack gap={4} align="center">
          <Spinner size="xl" color="brand.400" />
          
          <Text 
            fontSize="lg" 
            color="accent.600" 
            _dark={{ color: "accent.400" }}
            fontFamily="body"
          >
            Loading...
          </Text>
        </Stack>
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

