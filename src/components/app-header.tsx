import { Box, Container, Heading, Text, Button, Stack, HStack } from '@chakra-ui/react'
import { MenuRoot, MenuTrigger, MenuContent, MenuItem, MenuPositioner } from '@chakra-ui/react'
import { LuUser, LuLogOut, LuChevronDown } from 'react-icons/lu'
import { useAuth } from '@/context/auth.context'
import { useNavigate } from 'react-router-dom'

export function AppHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <Box 
      bg="white" 
      _dark={{ bg: "accent.800" }} 
      borderBottom="subtle"
      py={4}
    >
      <Container maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }}>
        <Stack direction="row" justify="space-between" align="center" w="full">
          <Heading
            fontSize="2xl"
            fontWeight="700"
            bgGradient="to-r"
            gradientFrom="brand.400"
            gradientTo="secondary.500"
            bgClip="text"
            fontFamily="heading"
            cursor="pointer"
            onClick={() => navigate('/dashboard')}
          >
            LeanSubs
          </Heading>

          <Box>
            <MenuRoot positioning={{ placement: "bottom-end", gutter: 8 }}>
              <MenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  borderColor="accent.200"
                  color="accent.700"
                  _hover={{ 
                    bg: "accent.50",
                    borderColor: "brand.400"
                  }}
                  _dark={{ 
                    borderColor: "accent.700",
                    color: "accent.300",
                    _hover: { 
                      bg: "accent.900",
                      borderColor: "brand.400"
                    } 
                  }}
                  px={4}
                  py={2}
                >
                  <HStack gap={2}>
                    <Text>{user?.name}</Text>
                    <Box as={LuChevronDown} fontSize="md" />
                  </HStack>
                </Button>
              </MenuTrigger>

              <MenuPositioner>
                <MenuContent
                  minW="220px"
                  bg="white"
                  _dark={{ bg: "accent.800" }}
                  border="subtle"
                  shadow="lg"
                  borderRadius="md"
                  py={2}
                >
                  <MenuItem
                    value="profile"
                    onClick={() => navigate('/profile')}
                    px={4}
                    py={3}
                    cursor="pointer"
                    _hover={{ 
                      bg: "accent.50",
                      _dark: { bg: "accent.700" }
                    }}
                    transition="all 0.2s"
                  >
                    <HStack gap={3}>
                      <Box 
                        as={LuUser} 
                        fontSize="lg"
                        color="brand.400"
                        _dark={{ color: "brand.300" }}
                      />
                      <Text
                        fontSize="md"
                        fontWeight="500"
                        fontFamily="body"
                        color="accent.800"
                        _dark={{ color: "accent.100" }}
                      >
                        Profile
                      </Text>
                    </HStack>
                  </MenuItem>

                  <MenuItem
                    value="logout"
                    onClick={handleLogout}
                    px={4}
                    py={3}
                    cursor="pointer"
                    _hover={{ 
                      bg: "danger.50",
                      _dark: { bg: "danger.950" }
                    }}
                    transition="all 0.2s"
                  >
                    <HStack gap={3}>
                      <Box 
                        as={LuLogOut} 
                        fontSize="lg"
                        color="danger.500"
                        _dark={{ color: "danger.400" }}
                      />
                      <Text
                        fontSize="md"
                        fontWeight="500"
                        fontFamily="body"
                        color="danger.500"
                        _dark={{ color: "danger.400" }}
                      >
                        Logout
                      </Text>
                    </HStack>
                  </MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

