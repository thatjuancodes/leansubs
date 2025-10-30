import { Box, Container, Heading, Text, Button, Stack, SimpleGrid, Badge, HStack } from '@chakra-ui/react'
import { LuUserPlus, LuCalendarPlus, LuCreditCard } from 'react-icons/lu'
import { useAuth } from '@/context/auth.context'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { memberService } from '@/services/member.service'
import { sessionService } from '@/services/session.service'
import { subscriptionService } from '@/services/subscription.service'

export function DashboardPage() {
  const { user, organization } = useAuth()
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
  const [subscriptionStats, setSubscriptionStats] = useState({
    total: 0,
    totalAmount: 0,
    totalCredits: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      if (!user || !organization) return
      
      try {
        const [memberStats, sessions, subscriptions] = await Promise.all([
          memberService.getStats(user.id),
          sessionService.getStats(user.id),
          subscriptionService.getStats(organization.id),
        ])
        setStats(memberStats)
        setSessionStats(sessions)
        setSubscriptionStats(subscriptions)
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [user, organization])

  return (
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
              {organization?.name || 'Organization'} Dashboard
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

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
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

              <StatCard
                title="Subscriptions"
                value={isLoading ? '...' : subscriptionStats.total.toString()}
                badge={`${subscriptionStats.totalCredits} credits sold`}
                badgeColor="success.500"
                onClick={() => navigate('/subscriptions')}
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

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
              <Button
                onClick={() => navigate('/members/add')}
                bg="secondary.500"
                _dark={{ bg: "secondary.600" }}
                border="subtle"
                shadow="base"
                h="auto"
                p={8}
                borderRadius="md"
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "lg",
                  bg: "secondary.600",
                  _dark: { bg: "secondary.700" }
                }}
                transition="all 0.2s ease-in-out"
              >
                <HStack gap={3} align="center" w="full">
                  <Box as={LuUserPlus} fontSize="2xl" color="white" />

                  <Stack gap={1} align="flex-start" flex={1}>
                    <Text
                      fontSize="lg"
                      fontWeight="600"
                      fontFamily="heading"
                      color="white"
                    >
                      Add Member
                    </Text>

                    <Text
                      fontSize="sm"
                      color="white"
                      fontFamily="body"
                      textAlign="left"
                      opacity={0.9}
                    >
                      Create a new member record
                    </Text>
                  </Stack>
                </HStack>
              </Button>

              <Button
                onClick={() => navigate('/sessions/add')}
                bg="brand.400"
                _dark={{ bg: "brand.500" }}
                border="subtle"
                shadow="base"
                h="auto"
                p={8}
                borderRadius="md"
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "lg",
                  bg: "brand.500",
                  _dark: { bg: "brand.600" }
                }}
                transition="all 0.2s ease-in-out"
              >
                <HStack gap={3} align="center" w="full">
                  <Box as={LuCalendarPlus} fontSize="2xl" color="white" />

                  <Stack gap={1} align="flex-start" flex={1}>
                    <Text
                      fontSize="lg"
                      fontWeight="600"
                      fontFamily="heading"
                      color="white"
                    >
                      Record Session
                    </Text>

                    <Text
                      fontSize="sm"
                      color="white"
                      fontFamily="body"
                      textAlign="left"
                      opacity={0.9}
                    >
                      Log a training session
                    </Text>
                  </Stack>
                </HStack>
              </Button>

              <Button
                onClick={() => navigate('/subscriptions/add')}
                bg="success.500"
                _dark={{ bg: "success.600" }}
                border="subtle"
                shadow="base"
                h="auto"
                p={8}
                borderRadius="md"
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "lg",
                  bg: "success.600",
                  _dark: { bg: "success.700" }
                }}
                transition="all 0.2s ease-in-out"
              >
                <HStack gap={3} align="center" w="full">
                  <Box as={LuCreditCard} fontSize="2xl" color="white" />

                  <Stack gap={1} align="flex-start" flex={1}>
                    <Text
                      fontSize="lg"
                      fontWeight="600"
                      fontFamily="heading"
                      color="white"
                    >
                      Add Subscription
                    </Text>

                    <Text
                      fontSize="sm"
                      color="white"
                      fontFamily="body"
                      textAlign="left"
                      opacity={0.9}
                    >
                      Record a payment
                    </Text>
                  </Stack>
                </HStack>
              </Button>
            </SimpleGrid>
          </Stack>
        </Stack>
      </Container>
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

