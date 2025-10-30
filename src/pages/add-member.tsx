import { useState } from 'react'
import { Box, Container, Heading, Text, Button, Stack, Input, SimpleGrid } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/auth.context'
import { memberService } from '@/services/member.service'
import type { MembershipType, MembershipStatus } from '@/types/member'

export function AddMemberPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [membershipType, setMembershipType] = useState<MembershipType | ''>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [credits, setCredits] = useState('')
  const [status, setStatus] = useState<MembershipStatus>('active')
  const [notes, setNotes] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!user) {
      setError('You must be logged in to add members')
      return
    }

    if (!membershipType) {
      setError('Please select a membership type')
      return
    }

    const creditsNum = parseInt(credits) || 0
    if (creditsNum < 0) {
      setError('Credits must be a positive number')
      return
    }

    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      await memberService.create(user.id, {
        fullName,
        email,
        phone: phone || undefined,
        membershipType: membershipType as MembershipType,
        status,
        startDate,
        endDate,
        credits: creditsNum,
        notes: notes || undefined,
      })

      setSuccess('Member record created successfully!')
      
      // Clear form
      setFullName('')
      setEmail('')
      setPhone('')
      setMembershipType('')
      setStartDate('')
      setEndDate('')
      setCredits('')
      setStatus('active')
      setNotes('')

      // Redirect after short delay
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create member record')
    } finally {
      setIsLoading(false)
    }
  }

  function handleCancel() {
    navigate('/dashboard')
  }

  return (
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
              Add Member Record
            </Heading>

            <Text
              fontSize="md"
              color="accent.600"
              _dark={{ color: "accent.400" }}
              fontFamily="body"
            >
              Create a new member profile and subscription record
            </Text>
          </Stack>

          {/* Form */}
          <Box
            as="form"
            onSubmit={handleSubmit}
            bg="white"
            _dark={{ bg: "accent.800" }}
            p={{ base: 6, md: 8 }}
            borderRadius="md"
            border="subtle"
            shadow="base"
          >
            <Stack gap={6}>
              {error && (
                <Box
                  bg="danger.50"
                  _dark={{ bg: "danger.900" }}
                  border="1px solid"
                  borderColor="danger.400"
                  borderRadius="md"
                  p={3}
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
                  borderColor="success.500"
                  borderRadius="md"
                  p={3}
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

              {/* Personal Information */}
              <Stack gap={4}>
                <Heading
                  fontSize="lg"
                  fontWeight="600"
                  fontFamily="heading"
                  color="accent.800"
                  _dark={{ color: "accent.100" }}
                >
                  Personal Information
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <Stack gap={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      color="accent.700"
                      _dark={{ color: "accent.300" }}
                      fontFamily="body"
                    >
                      Full Name *
                    </Text>

                    <Input
                      type="text"
                      placeholder="John Doe"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      borderColor="accent.200"
                      _dark={{ borderColor: "accent.700" }}
                      _hover={{ borderColor: "brand.400" }}
                      _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px #4CA9FF" }}
                      borderRadius="md"
                      fontFamily="body"
                      disabled={isLoading}
                      px={3}
                      py={2}
                    />
                  </Stack>

                  <Stack gap={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      color="accent.700"
                      _dark={{ color: "accent.300" }}
                      fontFamily="body"
                    >
                      Email *
                    </Text>

                    <Input
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      borderColor="accent.200"
                      _dark={{ borderColor: "accent.700" }}
                      _hover={{ borderColor: "brand.400" }}
                      _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px #4CA9FF" }}
                      borderRadius="md"
                      fontFamily="body"
                      disabled={isLoading}
                      px={3}
                      py={2}
                    />
                  </Stack>

                  <Stack gap={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      color="accent.700"
                      _dark={{ color: "accent.300" }}
                      fontFamily="body"
                    >
                      Phone Number
                    </Text>

                    <Input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      borderColor="accent.200"
                      _dark={{ borderColor: "accent.700" }}
                      _hover={{ borderColor: "brand.400" }}
                      _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px #4CA9FF" }}
                      borderRadius="md"
                      fontFamily="body"
                      disabled={isLoading}
                      px={3}
                      py={2}
                    />
                  </Stack>

                  <Stack gap={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      color="accent.700"
                      _dark={{ color: "accent.300" }}
                      fontFamily="body"
                    >
                      Status *
                    </Text>

                      <Box
                        as="select"
                        value={status}
                        onChange={(e) => setStatus((e.target as HTMLSelectElement).value as MembershipStatus)}
                        borderColor="accent.200"
                        _dark={{ borderColor: "accent.700", bg: "accent.900" }}
                        _hover={{ borderColor: "brand.400" }}
                        _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px #4CA9FF" }}
                        borderRadius="md"
                        fontFamily="body"
                        disabled={isLoading}
                        px={3}
                        py={2}
                        h="auto"
                        borderWidth="1px"
                        bg="white"
                        {...({} as any)}
                      >
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="paused">Paused</option>
                    </Box>
                  </Stack>
                </SimpleGrid>
              </Stack>

              {/* Membership Details */}
              <Stack gap={4}>
                <Heading
                  fontSize="lg"
                  fontWeight="600"
                  fontFamily="heading"
                  color="accent.800"
                  _dark={{ color: "accent.100" }}
                >
                  Membership Details
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <Stack gap={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      color="accent.700"
                      _dark={{ color: "accent.300" }}
                      fontFamily="body"
                    >
                      Membership Type *
                    </Text>

                    <Box
                      as="select"
                      placeholder="Select membership type"
                      required
                      value={membershipType}
                      onChange={(e) => {
                        const value = (e.target as HTMLSelectElement).value
                        setMembershipType(value as MembershipType | '')
                      }}
                      borderColor="accent.200"
                      _dark={{ borderColor: "accent.700", bg: "accent.900" }}
                      _hover={{ borderColor: "brand.400" }}
                      _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px #4CA9FF" }}
                      borderRadius="md"
                      fontFamily="body"
                      disabled={isLoading}
                      px={3}
                      py={2}
                      h="auto"
                      borderWidth="1px"
                      bg="white"
                      {...({} as any)}
                    >
                      <option value="">Select membership type</option>
                      <option value="basic">Basic - Monthly</option>
                      <option value="standard">Standard - Monthly</option>
                      <option value="premium">Premium - Monthly</option>
                      <option value="basic-annual">Basic - Annual</option>
                      <option value="standard-annual">Standard - Annual</option>
                      <option value="premium-annual">Premium - Annual</option>
                    </Box>
                  </Stack>

                  <Stack gap={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      color="accent.700"
                      _dark={{ color: "accent.300" }}
                      fontFamily="body"
                    >
                      Start Date *
                    </Text>

                    <Input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      borderColor="accent.200"
                      _dark={{ borderColor: "accent.700" }}
                      _hover={{ borderColor: "brand.400" }}
                      _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px #4CA9FF" }}
                      borderRadius="md"
                      fontFamily="body"
                      disabled={isLoading}
                      px={3}
                      py={2}
                    />
                  </Stack>

                  <Stack gap={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      color="accent.700"
                      _dark={{ color: "accent.300" }}
                      fontFamily="body"
                    >
                      End Date *
                    </Text>

                    <Input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      borderColor="accent.200"
                      _dark={{ borderColor: "accent.700" }}
                      _hover={{ borderColor: "brand.400" }}
                      _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px #4CA9FF" }}
                      borderRadius="md"
                      fontFamily="body"
                      disabled={isLoading}
                      px={3}
                      py={2}
                    />
                  </Stack>

                  <Stack gap={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      color="accent.700"
                      _dark={{ color: "accent.300" }}
                      fontFamily="body"
                    >
                      Credits *
                    </Text>

                    <Input
                      type="number"
                      required
                      min="0"
                      value={credits}
                      onChange={(e) => setCredits(e.target.value)}
                      placeholder="e.g. 10"
                      borderColor="accent.200"
                      _dark={{ borderColor: "accent.700" }}
                      _hover={{ borderColor: "brand.400" }}
                      _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px #4CA9FF" }}
                      borderRadius="md"
                      fontFamily="body"
                      disabled={isLoading}
                      px={3}
                      py={2}
                    />
                  </Stack>
                </SimpleGrid>
              </Stack>

              {/* Additional Notes */}
              <Stack gap={2}>
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="accent.700"
                  _dark={{ color: "accent.300" }}
                  fontFamily="body"
                >
                  Notes
                </Text>

                  <Box
                    as="textarea"
                    placeholder="Add any additional notes about the member..."
                    value={notes}
                    onChange={(e) => setNotes((e.target as HTMLTextAreaElement).value)}
                    borderColor="accent.200"
                    _dark={{ borderColor: "accent.700", bg: "accent.900" }}
                    _hover={{ borderColor: "brand.400" }}
                    _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px #4CA9FF" }}
                    borderRadius="md"
                    fontFamily="body"
                    disabled={isLoading}
                    px={3}
                    py={2}
                    minH="120px"
                    resize="vertical"
                    borderWidth="1px"
                    bg="white"
                    {...({} as any)}
                  />
              </Stack>

              {/* Action Buttons */}
              <Stack direction={{ base: "column", sm: "row" }} gap={4} justify="flex-end">
                <Button
                  type="button"
                  variant="outline"
                  borderColor="accent.200"
                  color="accent.700"
                  _hover={{ 
                    bg: "accent.50",
                    borderColor: "accent.400"
                  }}
                  _dark={{ 
                    borderColor: "accent.700",
                    color: "accent.300",
                    _hover: { 
                      bg: "accent.900",
                      borderColor: "accent.500"
                    } 
                  }}
                  onClick={handleCancel}
                  disabled={isLoading}
                  px={6}
                  py={3}
                  borderRadius="md"
                  fontWeight="600"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  backgroundColor="brand.400"
                  color="white"
                  _hover={{
                    bg: "brand.500",
                    transform: "translateY(-2px)",
                    shadow: "lg"
                  }}
                  borderRadius="md"
                  fontWeight="600"
                  transition="all 0.2s ease-in-out"
                  loading={isLoading}
                  loadingText="Saving..."
                  px={6}
                  py={3}
                >
                  Save Member Record
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
  )
}

