import { useState, useEffect, useRef } from 'react'
import { Box, Container, Heading, Text, Button, Stack, Input } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/auth.context'
import { subscriptionService } from '@/services/subscription.service'
import { memberService } from '@/services/member.service'
import type { Member } from '@/types/member'

export function AddSubscriptionPage() {
  const navigate = useNavigate()
  const { user, organization } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Members data for dropdown
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  
  // Form state
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [amount, setAmount] = useState('')
  const [credits, setCredits] = useState('')
  const [notes, setNotes] = useState('')

  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load members on mount
  useEffect(() => {
    if (user) {
      loadMembers()
    }
  }, [user])

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  async function loadMembers() {
    if (!user) return

    try {
      const data = await memberService.getAll(user.id)
      // Show all members (not just active ones)
      setMembers(data)
      setFilteredMembers(data)
    } catch (error) {
      console.error('Failed to load members:', error)
    }
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value)
    setShowDropdown(true)
    
    if (!value.trim()) {
      setFilteredMembers(members)
      return
    }

    const query = value.toLowerCase()
    const filtered = members.filter(m => 
      m.fullName.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query)
    )
    setFilteredMembers(filtered)
  }

  function handleMemberSelect(member: Member) {
    setSelectedMember(member)
    setSearchQuery(member.fullName)
    setShowDropdown(false)
  }

  function clearSelection() {
    setSelectedMember(null)
    setSearchQuery('')
    setFilteredMembers(members)
    inputRef.current?.focus()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!user || !organization) {
      setError('You must be logged in to add subscriptions')
      return
    }

    if (!selectedMember) {
      setError('Please select a member')
      return
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount')
      return
    }

    const creditsNum = parseInt(credits)
    if (isNaN(creditsNum) || creditsNum <= 0) {
      setError('Please enter a valid number of credits')
      return
    }

    setIsLoading(true)

    try {
      await subscriptionService.createSubscription(
        {
          memberId: selectedMember.id,
          amount: amountNum,
          credits: creditsNum,
          notes,
        },
        organization?.id || ''
      )

      setSuccess(`Subscription created! ${creditsNum} credits added to ${selectedMember.fullName}`)
      
      // Reset form
      setSelectedMember(null)
      setSearchQuery('')
      setAmount('')
      setCredits('')
      setNotes('')
      setFilteredMembers(members)
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/subscriptions')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create subscription')
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
              Add Subscription
            </Heading>

            <Text
              fontSize="lg"
              color="accent.600"
              _dark={{ color: "accent.400" }}
              fontFamily="body"
            >
              Record a payment and add credits to a member
            </Text>
          </Stack>

          {/* Form */}
          <Box
            as="form"
            onSubmit={handleSubmit}
            bg="white"
            _dark={{ bg: "accent.800" }}
            p={8}
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
                  borderColor="success.400"
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

              {/* Member Selection */}
              <Stack gap={2} position="relative" ref={dropdownRef}>
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="accent.700"
                  _dark={{ color: "accent.300" }}
                  fontFamily="body"
                >
                  Member *
                </Text>

                <Box position="relative">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for member..."
                    required
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    borderColor="accent.200"
                    _dark={{ borderColor: "accent.700" }}
                    _hover={{ borderColor: "brand.400" }}
                    _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px #4CA9FF" }}
                    borderRadius="md"
                    fontFamily="body"
                    disabled={isLoading}
                    px={3}
                    py={2}
                    bg={selectedMember ? "success.50" : "white"}
                    _dark={{ bg: selectedMember ? "success.900" : "accent.900" }}
                  />

                  {selectedMember && (
                    <Button
                      position="absolute"
                      right={2}
                      top="50%"
                      transform="translateY(-50%)"
                      size="sm"
                      variant="ghost"
                      onClick={clearSelection}
                      color="accent.600"
                      _hover={{ color: "danger.500" }}
                    >
                      ✕
                    </Button>
                  )}
                </Box>

                {/* Dropdown */}
                {showDropdown && !selectedMember && filteredMembers.length > 0 && (
                  <Box
                    position="absolute"
                    top="100%"
                    left={0}
                    right={0}
                    mt={1}
                    bg="white"
                    _dark={{ bg: "accent.800" }}
                    border="subtle"
                    borderRadius="md"
                    shadow="lg"
                    maxH="300px"
                    overflowY="auto"
                    zIndex={10}
                  >
                    {filteredMembers.map((member) => (
                      <Box
                        key={member.id}
                        p={3}
                        cursor="pointer"
                        _hover={{ bg: "accent.50", _dark: { bg: "accent.700" } }}
                        borderBottom="1px solid"
                        borderColor="accent.100"
                        _dark={{ borderColor: "accent.700" }}
                        onClick={() => handleMemberSelect(member)}
                      >
                        <Text
                          fontWeight="500"
                          color="accent.800"
                          _dark={{ color: "accent.100" }}
                          fontFamily="body"
                        >
                          {member.fullName}
                        </Text>

                        <Text
                          fontSize="sm"
                          color="accent.600"
                          _dark={{ color: "accent.400" }}
                          fontFamily="body"
                        >
                          {member.email} • {member.credits || 0} credits
                        </Text>
                      </Box>
                    ))}
                  </Box>
                )}

                {showDropdown && !selectedMember && filteredMembers.length === 0 && (
                  <Box
                    position="absolute"
                    top="100%"
                    left={0}
                    right={0}
                    mt={1}
                    bg="white"
                    _dark={{ bg: "accent.800" }}
                    border="subtle"
                    borderRadius="md"
                    shadow="lg"
                    p={3}
                    zIndex={10}
                  >
                    <Text
                      fontSize="sm"
                      color="accent.600"
                      _dark={{ color: "accent.400" }}
                      fontFamily="body"
                    >
                      No members found
                    </Text>
                  </Box>
                )}

                {selectedMember && (
                  <Text
                    fontSize="sm"
                    color="success.600"
                    _dark={{ color: "success.400" }}
                    fontFamily="body"
                  >
                    Selected: {selectedMember.fullName} (Current credits: {selectedMember.credits || 0})
                  </Text>
                )}
              </Stack>

              {/* Amount */}
              <Stack gap={2}>
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="accent.700"
                  _dark={{ color: "accent.300" }}
                  fontFamily="body"
                >
                  Amount *
                </Text>

                <Input
                  type="number"
                  placeholder="0.00"
                  required
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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

              {/* Credits */}
              <Stack gap={2}>
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="accent.700"
                  _dark={{ color: "accent.300" }}
                  fontFamily="body"
                >
                  Credits to Add *
                </Text>

                <Input
                  type="number"
                  placeholder="0"
                  required
                  min="1"
                  step="1"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
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

              {/* Notes */}
              <Stack gap={2}>
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="accent.700"
                  _dark={{ color: "accent.300" }}
                  fontFamily="body"
                >
                  Notes (Optional)
                </Text>

                <Input
                  type="text"
                  placeholder="Payment method, invoice number, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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

              {/* Actions */}
              <Stack direction={{ base: "column", sm: "row" }} gap={4} mt={4}>
                <Button
                  type="submit"
                  backgroundColor="brand.400"
                  color="white"
                  _hover={{ bg: "brand.500" }}
                  size="lg"
                  fontWeight="600"
                  isLoading={isLoading}
                  loadingText="Adding Subscription..."
                  flex={1}
                >
                  Add Subscription
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
                  onClick={handleCancel}
                  disabled={isLoading}
                  flex={1}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
  )
}

