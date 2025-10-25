import { useState, useEffect } from 'react'
import { Box, Container, Heading, Text, Button, Stack, Input, SimpleGrid, Card } from '@chakra-ui/react'
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/auth.context'
import { organizationService } from '@/services/organization.service'
import { CURRENCIES, type CurrencyCode } from '@/types/organization'
import { AppHeader } from '@/components/app-header'
import { formatCurrency } from '@/utils/currency'

export function OrganizationSettingsPage() {
  const navigate = useNavigate()
  const { user, organization } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [currency, setCurrency] = useState<CurrencyCode>('VND')
  const [sessionDefaultLength, setSessionDefaultLength] = useState('60')

  // Load current settings
  useEffect(() => {
    console.log('Organization in settings:', organization)
    console.log('Organization ID:', organization?.id)
    console.log('Organization keys:', organization ? Object.keys(organization) : 'null')
    if (organization?.settings) {
      setCurrency(organization.settings.currency)
      setSessionDefaultLength(organization.settings.sessionDefaultLengthMinutes.toString())
    } else if (organization && !organization.settings) {
      // Handle organizations without settings (migration case)
      setCurrency('VND')
      setSessionDefaultLength('60')
    }
  }, [organization])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    console.log('Submitting with organization:', organization)
    console.log('Organization ID in submit:', organization?.id)
    console.log('Organization full structure:', JSON.stringify(organization, null, 2))
    
    if (!organization) {
      setError('Organization not found. Please try logging out and back in.')
      return
    }

    if (!organization.id) {
      setError(`Organization ID is missing. Organization data: ${JSON.stringify(organization)}`)
      return
    }

    const lengthNum = parseInt(sessionDefaultLength)
    if (isNaN(lengthNum) || lengthNum <= 0) {
      setError('Session default length must be a positive number')
      return
    }

    setIsLoading(true)

    try {
      await organizationService.updateSettings(organization.id, {
        currency,
        sessionDefaultLengthMinutes: lengthNum,
      })

      setSuccess('Settings updated successfully! Please refresh the page to see changes.')

      // Reload the page after 2 seconds to reflect new settings
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
    } finally {
      setIsLoading(false)
    }
  }

  if (!organization) {
    return (
      <Box minH="100vh" bg="light" _dark={{ bg: "dark" }}>
        <AppHeader />
        <Container maxW="container.lg" mx="auto" px={{ base: 4, md: 8 }} py={8}>
          <Box
            bg="warning.50"
            _dark={{ bg: "warning.900" }}
            border="1px solid"
            borderColor="warning.400"
            borderRadius="md"
            px={5}
            py={4}
          >
            <Text
              fontSize="sm"
              color="warning.700"
              _dark={{ color: "warning.200" }}
              fontFamily="body"
            >
              Organization not loaded. Please try logging out and back in.
            </Text>
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg="light" _dark={{ bg: "dark" }}>
      <AppHeader />

      {/* Main Content */}
      <Container maxW="container.lg" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        <Stack gap={8}>
          {/* Page Header */}
          <Stack gap={2}>
            <Heading
              fontSize="3xl"
              fontWeight="700"
              fontFamily="heading"
              color="accent.800"
              _dark={{ color: "accent.100" }}
            >
              Organization Settings
            </Heading>

            <Text
              fontSize="lg"
              color="accent.600"
              _dark={{ color: "accent.400" }}
              fontFamily="body"
            >
              Manage {organization.name}'s preferences and defaults
            </Text>
          </Stack>

          {/* Form */}
          <Box
            as="form"
            onSubmit={handleSubmit}
          >
            <Stack gap={6}>
              {error && (
                <Box
                  bg="danger.50"
                  _dark={{ bg: "danger.900" }}
                  border="1px solid"
                  borderColor="danger.400"
                  borderRadius="md"
                  px={5}
                  py={4}
                >
                  <Text
                    fontSize="sm"
                    color="danger.700"
                    _dark={{ color: "danger.200" }}
                    fontFamily="body"
                  >
                    {error}
                  </Text>
                </Box>
              )}

              {success && (
                <Box
                  bg="success.50"
                  _dark={{ bg: "success.900" }}
                  border="1px solid"
                  borderColor="success.400"
                  borderRadius="md"
                  px={5}
                  py={4}
                >
                  <Text
                    fontSize="sm"
                    color="success.700"
                    _dark={{ color: "success.200" }}
                    fontFamily="body"
                  >
                    {success}
                  </Text>
                </Box>
              )}

              {/* Currency Settings */}
              <Card.Root
                bg="white"
                _dark={{ bg: "accent.800" }}
                border="subtle"
                shadow="base"
              >
                <Card.Header p={6}>
                  <Heading
                    fontSize="xl"
                    fontWeight="600"
                    fontFamily="heading"
                    color="accent.800"
                    _dark={{ color: "accent.100" }}
                  >
                    Currency Settings
                  </Heading>
                </Card.Header>

                <Card.Body px={6} pb={6}>
                  <Stack gap={4}>
                    <Stack gap={2}>
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        color="accent.700"
                        _dark={{ color: "accent.300" }}
                        fontFamily="body"
                      >
                        Currency *
                      </Text>

                      <NativeSelectRoot>
                        <NativeSelectField
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                          borderColor="accent.200"
                          _dark={{ borderColor: "accent.700" }}
                          _hover={{ borderColor: "brand.400" }}
                          _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px #4CA9FF" }}
                          borderRadius="md"
                          fontFamily="body"
                          disabled={isLoading}
                          px={4}
                          py={3}
                          h="auto"
                          minH="48px"
                        >
                          {Object.entries(CURRENCIES).map(([code, curr]) => (
                            <option key={code} value={code}>
                              {curr.symbol} - {curr.name} ({code})
                            </option>
                          ))}
                        </NativeSelectField>
                      </NativeSelectRoot>

                      <Text
                        fontSize="sm"
                        color="accent.600"
                        _dark={{ color: "accent.400" }}
                        fontFamily="body"
                      >
                        This will be used for all monetary displays across the app
                      </Text>
                    </Stack>

                    {/* Preview */}
                    <Box
                      bg="accent.50"
                      _dark={{ bg: "accent.900" }}
                      p={4}
                      borderRadius="md"
                      border="1px solid"
                      borderColor="accent.200"
                      _dark={{ borderColor: "accent.700" }}
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        color="accent.700"
                        _dark={{ color: "accent.300" }}
                        fontFamily="body"
                        mb={2}
                      >
                        Preview:
                      </Text>

                      <SimpleGrid columns={3} gap={3}>
                        <Box>
                          <Text fontSize="xs" color="accent.600" _dark={{ color: "accent.400" }}>
                            100
                          </Text>
                          <Text fontSize="md" fontWeight="600" color="accent.800" _dark={{ color: "accent.100" }}>
                            {formatCurrency(100, currency)}
                          </Text>
                        </Box>

                        <Box>
                          <Text fontSize="xs" color="accent.600" _dark={{ color: "accent.400" }}>
                            1,000
                          </Text>
                          <Text fontSize="md" fontWeight="600" color="accent.800" _dark={{ color: "accent.100" }}>
                            {formatCurrency(1000, currency)}
                          </Text>
                        </Box>

                        <Box>
                          <Text fontSize="xs" color="accent.600" _dark={{ color: "accent.400" }}>
                            10,000
                          </Text>
                          <Text fontSize="md" fontWeight="600" color="accent.800" _dark={{ color: "accent.100" }}>
                            {formatCurrency(10000, currency)}
                          </Text>
                        </Box>
                      </SimpleGrid>
                    </Box>
                  </Stack>
                </Card.Body>
              </Card.Root>

              {/* Session Defaults */}
              <Card.Root
                bg="white"
                _dark={{ bg: "accent.800" }}
                border="subtle"
                shadow="base"
              >
                <Card.Header p={6}>
                  <Heading
                    fontSize="xl"
                    fontWeight="600"
                    fontFamily="heading"
                    color="accent.800"
                    _dark={{ color: "accent.100" }}
                  >
                    Session Defaults
                  </Heading>
                </Card.Header>

                <Card.Body px={6} pb={6}>
                  <Stack gap={4}>
                    <Stack gap={2}>
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        color="accent.700"
                        _dark={{ color: "accent.300" }}
                        fontFamily="body"
                      >
                        Default Session Length (minutes) *
                      </Text>

                      <Input
                        type="number"
                        placeholder="60"
                        value={sessionDefaultLength}
                        onChange={(e) => setSessionDefaultLength(e.target.value)}
                        min="1"
                        step="1"
                        borderColor="accent.200"
                        _dark={{ borderColor: "accent.700" }}
                        _hover={{ borderColor: "brand.400" }}
                        _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px #4CA9FF" }}
                        borderRadius="md"
                        fontFamily="body"
                        disabled={isLoading}
                        px={5}
                        py={3}
                      />

                      <Text
                        fontSize="sm"
                        color="accent.600"
                        _dark={{ color: "accent.400" }}
                        fontFamily="body"
                      >
                        When recording a session, the end time will automatically be set to start time + this duration
                      </Text>
                    </Stack>

                    {/* Preview */}
                    <Box
                      bg="accent.50"
                      _dark={{ bg: "accent.900" }}
                      p={4}
                      borderRadius="md"
                      border="1px solid"
                      borderColor="accent.200"
                      _dark={{ borderColor: "accent.700" }}
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        color="accent.700"
                        _dark={{ color: "accent.300" }}
                        fontFamily="body"
                        mb={2}
                      >
                        Example:
                      </Text>

                      <Text fontSize="sm" color="accent.600" _dark={{ color: "accent.400" }}>
                        If a session starts at <strong>2:00 PM</strong>, it will automatically end at{' '}
                        <strong>
                          {(() => {
                            const length = parseInt(sessionDefaultLength) || 60
                            const endHour = Math.floor((14 * 60 + length) / 60)
                            const endMin = (14 * 60 + length) % 60
                            const period = endHour >= 12 ? 'PM' : 'AM'
                            const displayHour = endHour > 12 ? endHour - 12 : endHour
                            return `${displayHour}:${endMin.toString().padStart(2, '0')} ${period}`
                          })()}
                        </strong>
                      </Text>
                    </Box>
                  </Stack>
                </Card.Body>
              </Card.Root>

              {/* Actions */}
              <Stack direction={{ base: "column", sm: "row" }} gap={4}>
                <Button
                  type="submit"
                  backgroundColor="brand.400"
                  color="white"
                  _hover={{ bg: "brand.500" }}
                  size="lg"
                  fontWeight="600"
                  isLoading={isLoading}
                  loadingText="Saving..."
                  flex={1}
                  px={5}
                >
                  Save Settings
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  borderColor="accent.200"
                  color="accent.700"
                  _hover={{ bg: "accent.50" }}
                  _dark={{
                    borderColor: "accent.700",
                    color: "accent.300",
                    _hover: { bg: "accent.900" }
                  }}
                  size="lg"
                  fontWeight="600"
                  onClick={() => navigate('/dashboard')}
                  disabled={isLoading}
                  flex={1}
                  px={5}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

