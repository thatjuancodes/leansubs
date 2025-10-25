import { useState, useEffect } from 'react'
import { Box, Container, Heading, Text, Button, Stack, Badge, SimpleGrid, HStack, IconButton } from '@chakra-ui/react'
import { LuTrash2 } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/auth.context'
import { authService } from '@/services/auth.service'
import { subscriptionService } from '@/services/subscription.service'
import { AppHeader } from '@/components/app-header'
import { DeleteSubscriptionModal } from '@/components/delete-subscription-modal'
import { formatCurrency } from '@/utils/currency'
import type { Subscription } from '@/types/subscription'

export function SubscriptionsPage() {
  const navigate = useNavigate()
  const { user, organization } = useAuth()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    totalCredits: 0,
  })
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<Subscription | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    loadSubscriptions()
  }, [user, organization])

  async function loadSubscriptions() {
    if (!user || !organization) return

    try {
      const [data, statsData] = await Promise.all([
        subscriptionService.getAll(organization.id),
        subscriptionService.getStats(organization.id),
      ])
      setSubscriptions(data)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load subscriptions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function formatCurrencyAmount(amount: number): string {
    return formatCurrency(amount, organization?.settings?.currency || 'VND')
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  function formatDateTime(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  function handleDeleteClick(subscription: Subscription) {
    setSubscriptionToDelete(subscription)
    setIsDeleteModalOpen(true)
  }

  async function handleDeleteConfirm(password: string) {
    if (!user || !organization || !subscriptionToDelete) return

    // Verify password
    try {
      await authService.login({
        email: user.email,
        password,
      })
    } catch (error) {
      throw new Error('Invalid password')
    }

    // Delete subscription
    await subscriptionService.delete(subscriptionToDelete.id, organization.id)

    // Reload subscriptions
    await loadSubscriptions()
  }

  function handleDeleteCancel() {
    setSubscriptionToDelete(null)
    setIsDeleteModalOpen(false)
  }

  return (
    <Box minH="100vh" bg="light" _dark={{ bg: "dark" }}>
      <AppHeader />

      {/* Main Content */}
      <Container maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        <Stack gap={8}>
          {/* Page Header */}
          <Stack direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "stretch", md: "center" }} gap={4}>
            <Stack gap={2}>
              <Heading
                fontSize="3xl"
                fontWeight="700"
                fontFamily="heading"
                color="accent.800"
                _dark={{ color: "accent.100" }}
              >
                Subscriptions
              </Heading>

              <Text
                fontSize="md"
                color="accent.600"
                _dark={{ color: "accent.400" }}
                fontFamily="body"
              >
                {isLoading ? 'Loading...' : `${subscriptions.length} subscription${subscriptions.length !== 1 ? 's' : ''}`}
              </Text>
            </Stack>

            <Button
              backgroundColor="brand.400"
              color="white"
              _hover={{
                bg: "brand.500",
                transform: "translateY(-2px)",
                shadow: "md"
              }}
              transition="all 0.2s ease-in-out"
              onClick={() => navigate('/subscriptions/add')}
              px={6}
              py={2}
              size="md"
              fontWeight="600"
            >
              + Add Subscription
            </Button>
          </Stack>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            <Box
              bg="white"
              _dark={{ bg: "accent.800" }}
              p={6}
              borderRadius="md"
              border="subtle"
              shadow="base"
            >
              <Stack gap={2}>
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="accent.600"
                  _dark={{ color: "accent.400" }}
                  fontFamily="body"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Total Subscriptions
                </Text>

                <Heading
                  fontSize="4xl"
                  fontWeight="700"
                  fontFamily="heading"
                  color="accent.800"
                  _dark={{ color: "accent.100" }}
                >
                  {stats.total}
                </Heading>
              </Stack>
            </Box>

            <Box
              bg="white"
              _dark={{ bg: "accent.800" }}
              p={6}
              borderRadius="md"
              border="subtle"
              shadow="base"
            >
              <Stack gap={2}>
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="accent.600"
                  _dark={{ color: "accent.400" }}
                  fontFamily="body"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Total Revenue
                </Text>

                <Heading
                  fontSize="4xl"
                  fontWeight="700"
                  fontFamily="heading"
                  color="success.600"
                  _dark={{ color: "success.400" }}
                >
                  {formatCurrencyAmount(stats.totalAmount)}
                </Heading>
              </Stack>
            </Box>

            <Box
              bg="white"
              _dark={{ bg: "accent.800" }}
              p={6}
              borderRadius="md"
              border="subtle"
              shadow="base"
            >
              <Stack gap={2}>
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="accent.600"
                  _dark={{ color: "accent.400" }}
                  fontFamily="body"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Total Credits Sold
                </Text>

                <Heading
                  fontSize="4xl"
                  fontWeight="700"
                  fontFamily="heading"
                  color="brand.400"
                  _dark={{ color: "brand.300" }}
                >
                  {stats.totalCredits}
                </Heading>
              </Stack>
            </Box>
          </SimpleGrid>

          {/* Subscriptions List */}
          {isLoading ? (
            <Text
              fontSize="lg"
              color="accent.600"
              _dark={{ color: "accent.400" }}
              textAlign="center"
              py={12}
              fontFamily="body"
            >
              Loading subscriptions...
            </Text>
          ) : subscriptions.length === 0 ? (
            <Box
              bg="white"
              _dark={{ bg: "accent.800" }}
              p={12}
              borderRadius="md"
              border="subtle"
              textAlign="center"
            >
              <Text
                fontSize="lg"
                color="accent.600"
                _dark={{ color: "accent.400" }}
                fontFamily="body"
                mb={4}
              >
                No subscriptions yet
              </Text>

              <Button
                backgroundColor="brand.400"
                color="white"
                _hover={{ bg: "brand.500" }}
                onClick={() => navigate('/subscriptions/add')}
                px={6}
                py={2}
                size="md"
                fontWeight="600"
              >
                Add Your First Subscription
              </Button>
            </Box>
          ) : (
            <Stack gap={4}>
              {subscriptions.map((subscription) => (
                <Box
                  key={subscription.id}
                  bg="white"
                  _dark={{ bg: "accent.800" }}
                  p={6}
                  borderRadius="md"
                  border="subtle"
                  shadow="base"
                  transition="all 0.2s ease-in-out"
                  _hover={{
                    shadow: "md",
                    borderColor: "brand.400"
                  }}
                >
                  <Stack gap={4}>
                    {/* Header Row */}
                    <Stack direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "flex-start", md: "center" }} gap={2}>
                      <Stack gap={1} flex={1}>
                        <Heading
                          fontSize="xl"
                          fontWeight="600"
                          fontFamily="heading"
                          color="accent.800"
                          _dark={{ color: "accent.100" }}
                        >
                          {subscription.memberName}
                        </Heading>

                        <Text
                          fontSize="sm"
                          color="accent.600"
                          _dark={{ color: "accent.400" }}
                          fontFamily="body"
                        >
                          {formatDateTime(subscription.createdAt)}
                        </Text>
                      </Stack>

                      <HStack gap={2}>
                        <Badge
                          backgroundColor="success.500"
                          color="white"
                          px={3}
                          py={1}
                          borderRadius="md"
                          fontSize="sm"
                          fontWeight="600"
                        >
                          {formatCurrencyAmount(subscription.amount)}
                        </Badge>

                        <Badge
                          backgroundColor="brand.400"
                          color="white"
                          px={3}
                          py={1}
                          borderRadius="md"
                          fontSize="sm"
                          fontWeight="600"
                        >
                          +{subscription.credits} credits
                        </Badge>

                        <IconButton
                          aria-label="Delete subscription"
                          size="sm"
                          variant="ghost"
                          color="danger.500"
                          _hover={{ bg: "danger.50", _dark: { bg: "danger.900" } }}
                          onClick={() => handleDeleteClick(subscription)}
                        >
                          <LuTrash2 />
                        </IconButton>
                      </HStack>
                    </Stack>

                    {/* Notes */}
                    {subscription.notes && (
                      <Text
                        fontSize="sm"
                        color="accent.600"
                        _dark={{ color: "accent.400" }}
                        fontFamily="body"
                        fontStyle="italic"
                      >
                        Note: {subscription.notes}
                      </Text>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      </Container>

      {/* Delete Confirmation Modal */}
      <DeleteSubscriptionModal
        subscription={subscriptionToDelete}
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  )
}

