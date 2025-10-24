import { Box, Container, Heading, Text, Button, Stack, SimpleGrid, Badge } from '@chakra-ui/react'
import { useAuth } from '@/context/auth.context'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { memberService } from '@/services/member.service'
import { sessionService } from '@/services/session.service'

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    cancelled: 0,
    paused: 0,
  })
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    unverified: 0,
    verified: 0,
    totalCreditsUsed: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      if (!user) return
      
      try {
        const [memberStats, sessions] = await Promise.all([
          memberService.getStats(user.id),
          sessionService.getStats(user.id),
        ])
        setStats(memberStats)
        setSessionStats(sessions)
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [user])

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

          {/* Overview Cards */}
          <Stack gap={4}>
            <Heading
              fontSize="xl"
              fontWeight="600"
              fontFamily="heading"
              color="accent.800"
              _dark={{ color: "accent.100" }}
            >
              Overview
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              <StatCard
                title="Total Members"
                value={isLoading ? '...' : stats.total.toString()}
                badge={`${stats.active} active • ${stats.paused} paused`}
                badgeColor="brand.400"
                onClick={() => navigate('/members')}
              />

              <StatCard
                title="Total Sessions"
                value={isLoading ? '...' : sessionStats.total.toString()}
                badge={`${sessionStats.totalCreditsUsed} credits used`}
                badgeColor="secondary.500"
                onClick={() => navigate('/sessions')}
              />
            </SimpleGrid>
          </Stack>

          {/* Quick Actions */}
          <Stack gap={4}>
            <Heading
              fontSize="xl"
              fontWeight="600"
              fontFamily="heading"
              color="accent.800"
              _dark={{ color: "accent.100" }}
            >
              Quick Actions
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
              <Button
                onClick={() => navigate('/members/add')}
                bg="white"
                _dark={{ bg: "accent.800" }}
                border="subtle"
                shadow="base"
                h="auto"
                p={6}
                borderRadius="md"
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "lg",
                  borderColor: "brand.400"
                }}
                transition="all 0.2s ease-in-out"
              >
                <Stack gap={3} align="flex-start" w="full">
                  <Text fontSize="2xl">➕</Text>

                  <Stack gap={1} align="flex-start">
                    <Text
                      fontSize="md"
                      fontWeight="600"
                      fontFamily="heading"
                      color="accent.800"
                      _dark={{ color: "accent.100" }}
                    >
                      Add Member
                    </Text>

                    <Text
                      fontSize="sm"
                      color="accent.600"
                      _dark={{ color: "accent.400" }}
                      fontFamily="body"
                      textAlign="left"
                    >
                      Create a new member record
                    </Text>
                  </Stack>
                </Stack>
              </Button>

              <Button
                onClick={() => navigate('/members')}
                bg="white"
                _dark={{ bg: "accent.800" }}
                border="subtle"
                shadow="base"
                h="auto"
                p={6}
                borderRadius="md"
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "lg",
                  borderColor: "brand.400"
                }}
                transition="all 0.2s ease-in-out"
              >
                <Stack gap={3} align="flex-start" w="full">
                  <Text fontSize="2xl">📊</Text>

                  <Stack gap={1} align="flex-start">
                    <Text
                      fontSize="md"
                      fontWeight="600"
                      fontFamily="heading"
                      color="accent.800"
                      _dark={{ color: "accent.100" }}
                    >
                      View Members
                    </Text>

                    <Text
                      fontSize="sm"
                      color="accent.600"
                      _dark={{ color: "accent.400" }}
                      fontFamily="body"
                      textAlign="left"
                    >
                      See all member records
                    </Text>
                  </Stack>
                </Stack>
              </Button>

              <Button
                onClick={() => navigate('/sessions/add')}
                bg="white"
                _dark={{ bg: "accent.800" }}
                border="subtle"
                shadow="base"
                h="auto"
                p={6}
                borderRadius="md"
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "lg",
                  borderColor: "brand.400"
                }}
                transition="all 0.2s ease-in-out"
              >
                <Stack gap={3} align="flex-start" w="full">
                  <Text fontSize="2xl">📅</Text>

                  <Stack gap={1} align="flex-start">
                    <Text
                      fontSize="md"
                      fontWeight="600"
                      fontFamily="heading"
                      color="accent.800"
                      _dark={{ color: "accent.100" }}
                    >
                      Record Session
                    </Text>

                    <Text
                      fontSize="sm"
                      color="accent.600"
                      _dark={{ color: "accent.400" }}
                      fontFamily="body"
                      textAlign="left"
                    >
                      Log a training session
                    </Text>
                  </Stack>
                </Stack>
              </Button>

              <Button
                onClick={() => navigate('/sessions')}
                bg="white"
                _dark={{ bg: "accent.800" }}
                border="subtle"
                shadow="base"
                h="auto"
                p={6}
                borderRadius="md"
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "lg",
                  borderColor: "brand.400"
                }}
                transition="all 0.2s ease-in-out"
              >
                <Stack gap={3} align="flex-start" w="full">
                  <Text fontSize="2xl">✅</Text>

                  <Stack gap={1} align="flex-start">
                    <Text
                      fontSize="md"
                      fontWeight="600"
                      fontFamily="heading"
                      color="accent.800"
                      _dark={{ color: "accent.100" }}
                    >
                      View Sessions
                    </Text>

                    <Text
                      fontSize="sm"
                      color="accent.600"
                      _dark={{ color: "accent.400" }}
                      fontFamily="body"
                      textAlign="left"
                    >
                      Review and verify sessions
                    </Text>
                  </Stack>
                </Stack>
              </Button>
            </SimpleGrid>
          </Stack>
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
  onClick?: () => void
}

function StatCard({ title, value, badge, badgeColor, onClick }: StatCardProps) {
  return (
    <Box
      bg="white"
      _dark={{ bg: "accent.800" }}
      p={6}
      borderRadius="md"
      border="subtle"
      shadow="base"
      cursor={onClick ? "pointer" : "default"}
      onClick={onClick}
      _hover={onClick ? {
        transform: "translateY(-2px)",
        shadow: "lg",
        borderColor: "brand.400"
      } : undefined}
      transition="all 0.2s ease-in-out"
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

