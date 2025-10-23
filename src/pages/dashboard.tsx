import { Box, Container, Heading, Text, Button, Stack, SimpleGrid, Badge } from '@chakra-ui/react'
import { useAuth } from '@/context/auth.context'
import { useNavigate } from 'react-router-dom'

export function DashboardPage() {
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
    <Box minH="100vh" bg="light" _dark={{ bg: "dark" }}>
      {/* Header */}
      <Box 
        bg="white" 
        _dark={{ bg: "accent.800" }} 
        borderBottom="subtle"
        py={4}
      >
        <Container maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }}>
          <Stack direction="row" justify="space-between" align="center">
            <Heading
              fontSize="2xl"
              fontWeight="700"
              bgGradient="to-r"
              gradientFrom="brand.400"
              gradientTo="secondary.500"
              bgClip="text"
              fontFamily="heading"
            >
              LeanSubs
            </Heading>

            <Button
              size="sm"
              variant="outline"
              borderColor="accent.200"
              color="accent.700"
              _hover={{ 
                bg: "accent.50",
                borderColor: "danger.400",
                color: "danger.400"
              }}
              _dark={{ 
                borderColor: "accent.700",
                color: "accent.300",
                _hover: { 
                  bg: "accent.900",
                  borderColor: "danger.400",
                  color: "danger.400"
                } 
              }}
              onClick={handleLogout}
              px={4}
              py={2}
            >
              Logout
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        <Stack gap={8}>
          {/* Welcome Section */}
          <Stack gap={2}>
            <Heading
              fontSize="3xl"
              fontWeight="700"
              fontFamily="heading"
              color="accent.800"
              _dark={{ color: "accent.100" }}
            >
              Welcome back, {user?.name}!
            </Heading>

            <Text
              fontSize="lg"
              color="accent.600"
              _dark={{ color: "accent.400" }}
              fontFamily="body"
            >
              {user?.businessName} Dashboard
            </Text>
          </Stack>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            <StatCard
              title="Active Subscriptions"
              value="0"
              badge="No data yet"
              badgeColor="accent.500"
            />

            <StatCard
              title="Total Sessions"
              value="0"
              badge="No data yet"
              badgeColor="accent.500"
            />

            <StatCard
              title="Active Members"
              value="0"
              badge="No data yet"
              badgeColor="accent.500"
            />
          </SimpleGrid>

          {/* Coming Soon Message */}
          <Box
            bg="white"
            _dark={{ bg: "accent.800" }}
            p={8}
            borderRadius="md"
            border="subtle"
            shadow="base"
            textAlign="center"
          >
            <Stack gap={4}>
              <Text fontSize="4xl">🚀</Text>

              <Heading
                fontSize="2xl"
                fontWeight="600"
                fontFamily="heading"
                color="accent.800"
                _dark={{ color: "accent.100" }}
              >
                Dashboard Coming Soon
              </Heading>

              <Text
                color="accent.600"
                _dark={{ color: "accent.400" }}
                fontFamily="body"
                maxW="2xl"
                mx="auto"
              >
                Your subscription management dashboard is being built. Soon you'll be able to track subscriptions, 
                manage sessions, and monitor member progress all from here.
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

interface StatCardProps {
  title: string
  value: string
  badge: string
  badgeColor: string
}

function StatCard({ title, value, badge, badgeColor }: StatCardProps) {
  return (
    <Box
      bg="white"
      _dark={{ bg: "accent.800" }}
      p={6}
      borderRadius="md"
      border="subtle"
      shadow="base"
    >
      <Stack gap={3}>
        <Text
          fontSize="sm"
          fontWeight="500"
          color="accent.600"
          _dark={{ color: "accent.400" }}
          fontFamily="body"
          textTransform="uppercase"
          letterSpacing="wide"
        >
          {title}
        </Text>

        <Heading
          fontSize="4xl"
          fontWeight="700"
          fontFamily="heading"
          color="accent.800"
          _dark={{ color: "accent.100" }}
        >
          {value}
        </Heading>

        <Badge
          backgroundColor={badgeColor}
          color="white"
          px={2}
          py={1}
          borderRadius="md"
          fontSize="xs"
          w="fit-content"
        >
          {badge}
        </Badge>
      </Stack>
    </Box>
  )
}

