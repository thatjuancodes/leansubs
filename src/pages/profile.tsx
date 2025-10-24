import { Box, Container, Heading, Text, Stack, SimpleGrid, Card, Input } from '@chakra-ui/react'
import { Button, HStack } from '@chakra-ui/react'
import { LuUser, LuMail, LuBuilding2, LuCalendar, LuLock } from 'react-icons/lu'
import { useAuth } from '@/context/auth.context'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/app-header'

export function ProfilePage() {
  const { user, organization } = useAuth()
  const navigate = useNavigate()

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Box minH="100vh" bg="light" _dark={{ bg: "dark" }}>
      <AppHeader />

      {/* Main Content */}
      <Container maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        <Stack gap={8}>
          {/* Page Header with Back Button */}
          <Stack direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "stretch", md: "center" }} gap={4}>
            <Stack gap={2}>
              <Heading
                fontSize="3xl"
                fontWeight="700"
                fontFamily="heading"
                color="accent.800"
                _dark={{ color: "accent.100" }}
              >
                Profile
              </Heading>

              <Text
                fontSize="lg"
                color="accent.600"
                _dark={{ color: "accent.400" }}
                fontFamily="body"
              >
                View your account information
              </Text>
            </Stack>

            <Button
              onClick={() => navigate('/dashboard')}
              bg="brand.400"
              color="white"
              _hover={{ bg: "brand.500" }}
              _dark={{ 
                bg: "brand.500",
                _hover: { bg: "brand.600" }
              }}
              size="md"
              alignSelf={{ base: "stretch", md: "center" }}
              px={5}
            >
              Back to Dashboard
            </Button>
          </Stack>

          {/* Profile Information */}
          <Card.Root
            bg="white"
            _dark={{ bg: "accent.800" }}
            border="subtle"
            shadow="base"
            p={8}
          >
            <Stack gap={6}>
              <Heading
                fontSize="lg"
                fontWeight="600"
                fontFamily="heading"
                color="accent.800"
                _dark={{ color: "accent.100" }}
              >
                Account Information
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
                <ProfileField
                  icon={LuUser}
                  label="Full Name"
                  value={user?.name || 'N/A'}
                />

                <ProfileField
                  icon={LuMail}
                  label="Email Address"
                  value={user?.email || 'N/A'}
                />

              <ProfileField
                icon={LuBuilding2}
                label="Organization Name"
                value={organization?.name || 'N/A'}
              />

                <ProfileField
                  icon={LuCalendar}
                  label="Member Since"
                  value={user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                />
              </SimpleGrid>
            </Stack>
          </Card.Root>

          {/* Change Password Section (Disabled) */}
          <Card.Root
            bg="white"
            _dark={{ bg: "accent.800" }}
            border="subtle"
            shadow="base"
            p={8}
          >
            <Stack gap={6}>
              <Stack gap={1}>
                <Heading
                  fontSize="lg"
                  fontWeight="600"
                  fontFamily="heading"
                  color="accent.800"
                  _dark={{ color: "accent.100" }}
                >
                  Change Password
                </Heading>

                <Text
                  fontSize="sm"
                  color="accent.600"
                  _dark={{ color: "accent.400" }}
                  fontFamily="body"
                >
                  Coming soon - Password change functionality is not available yet
                </Text>
              </Stack>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                <Stack gap={2}>
                  <Text
                    fontSize="sm"
                    fontWeight="500"
                    color="accent.600"
                    _dark={{ color: "accent.400" }}
                    fontFamily="body"
                  >
                    Current Password
                  </Text>
                  <Box position="relative">
                    <Box 
                      as={LuLock} 
                      fontSize="lg" 
                      color="accent.400"
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      zIndex={1}
                    />
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      disabled
                      pl={10}
                      bg="accent.50"
                      _dark={{ bg: "accent.900" }}
                      cursor="not-allowed"
                    />
                  </Box>
                </Stack>

                <Box /> {/* Empty space for grid alignment */}

                <Stack gap={2}>
                  <Text
                    fontSize="sm"
                    fontWeight="500"
                    color="accent.600"
                    _dark={{ color: "accent.400" }}
                    fontFamily="body"
                  >
                    New Password
                  </Text>
                  <Box position="relative">
                    <Box 
                      as={LuLock} 
                      fontSize="lg" 
                      color="accent.400"
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      zIndex={1}
                    />
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      disabled
                      pl={10}
                      bg="accent.50"
                      _dark={{ bg: "accent.900" }}
                      cursor="not-allowed"
                    />
                  </Box>
                </Stack>

                <Stack gap={2}>
                  <Text
                    fontSize="sm"
                    fontWeight="500"
                    color="accent.600"
                    _dark={{ color: "accent.400" }}
                    fontFamily="body"
                  >
                    Confirm New Password
                  </Text>
                  <Box position="relative">
                    <Box 
                      as={LuLock} 
                      fontSize="lg" 
                      color="accent.400"
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      zIndex={1}
                    />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      disabled
                      pl={10}
                      bg="accent.50"
                      _dark={{ bg: "accent.900" }}
                      cursor="not-allowed"
                    />
                  </Box>
                </Stack>
              </SimpleGrid>

              <Button
                disabled
                bg="accent.200"
                color="accent.500"
                cursor="not-allowed"
                _hover={{}}
                size="md"
                w={{ base: "full", md: "auto" }}
                alignSelf={{ base: "stretch", md: "flex-start" }}
                px={5}
              >
                Update Password
              </Button>
            </Stack>
          </Card.Root>
        </Stack>
      </Container>
    </Box>
  )
}

interface ProfileFieldProps {
  icon: React.ElementType
  label: string
  value: string
}

function ProfileField({ icon, label, value }: ProfileFieldProps) {
  return (
    <Stack gap={3}>
      <HStack gap={2}>
        <Box 
          as={icon} 
          fontSize="lg" 
          color="brand.400"
          _dark={{ color: "brand.300" }}
        />

        <Text
          fontSize="sm"
          fontWeight="500"
          color="accent.600"
          _dark={{ color: "accent.400" }}
          fontFamily="body"
          textTransform="uppercase"
          letterSpacing="wide"
        >
          {label}
        </Text>
      </HStack>

      <Text
        fontSize="lg"
        fontWeight="600"
        fontFamily="body"
        color="accent.800"
        _dark={{ color: "accent.100" }}
        pl={7}
      >
        {value}
      </Text>
    </Stack>
  )
}

