import { useState, useEffect, useRef } from 'react'
import { Box, Container, Heading, Text, Button, Stack, Input } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/auth.context'
import { sessionService } from '@/services/session.service'
import { memberService } from '@/services/member.service'
import { AppHeader } from '@/components/app-header'
import type { Member } from '@/types/member'

export function AddSessionPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Members data
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  
  // Form state
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [creditsUsed, setCreditsUsed] = useState('1')
  const [notes, setNotes] = useState('')

  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load members on mount
  useEffect(() => {
    if (user) {
      loadMembers()
    }
  }, [user])

  // Set default start time to now
  useEffect(() => {
    const now = new Date()
    // Format as datetime-local format (YYYY-MM-DDTHH:MM)
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    
    setStartTime(`${year}-${month}-${day}T${hours}:${minutes}`)
  }, [])

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
      // Only show active members with credits (handle undefined credits from old records)
      const activeMembers = data.filter(m => m.status === 'active' && (m.credits ?? 0) > 0)
      setMembers(activeMembers)
      setFilteredMembers(activeMembers)
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
    
    if (!user) {
      setError('You must be logged in to add sessions')
      return
    }

    if (!selectedMember) {
      setError('Please select a member')
      return
    }

    const creditsNum = parseInt(creditsUsed) || 1
    if (creditsNum < 1) {
      setError('Credits used must be at least 1')
      return
    }

    const memberCredits = selectedMember.credits ?? 0
    if (creditsNum > memberCredits) {
      setError(`Member only has ${memberCredits} credit(s) available`)
      return
    }

    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      await sessionService.create(user.id, {
        memberId: selectedMember.id,
        startTime: new Date(startTime).toISOString(),
        endTime: endTime ? new Date(endTime).toISOString() : undefined,
        creditsUsed: creditsNum,
        notes: notes || undefined,
      })

      setSuccess('Session recorded successfully!')
      
      // Clear form
      setSelectedMember(null)
      setSearchQuery('')
      setCreditsUsed('1')
      setEndTime('')
      setNotes('')
      
      // Reset start time to now
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      setStartTime(`${year}-${month}-${day}T${hours}:${minutes}`)

      // Reload members to get updated credits
      await loadMembers()

      // Redirect after short delay
      setTimeout(() => {
        navigate('/sessions')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session record')
    } finally {
      setIsLoading(false)
    }
  }

  function handleCancel() {
    navigate('/dashboard')
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
              Add Session Record
            </Heading>

            <Text
              fontSize="md"
              color="accent.600"
              _dark={{ color: "accent.400" }}
              fontFamily="body"
            >
              Record a new gym/training session for a member
            </Text>
          </Stack>

          {/* Form */}
          <Box
            as="form"
            onSubmit={handleSubmit}
            bg="white"
            _dark={{ bg: "accent.800" }}
            p={{ base: 6, md: 8 }}
            borderRadius="lg"
            border="subtle"
            shadow="base"
          >
            <Stack gap={6}>
              {/* Error Message */}
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

              {/* Success Message */}
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

              {/* Member Selection with Searchable Dropdown */}
              <Stack gap={2} position="relative" ref={dropdownRef}>
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="accent.700"
                  _dark={{ color: "accent.300" }}
                  fontFamily="body"
                >
                  Select Member *
                </Text>

                {selectedMember ? (
                  <Box
                    p={3}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="brand.400"
                    bg="brand.50"
                    _dark={{ bg: "brand.900", borderColor: "brand.600" }}
                  >
                    <Stack direction="row" justify="space-between" align="center">
                      <Stack gap={1}>
                        <Text
                          fontSize="md"
                          fontWeight="600"
                          color="accent.800"
                          _dark={{ color: "accent.100" }}
                          fontFamily="body"
                        >
                          {selectedMember.fullName}
                        </Text>

                        <Text
                          fontSize="sm"
                          color="accent.600"
                          _dark={{ color: "accent.400" }}
                          fontFamily="body"
                        >
                          {selectedMember.email} • {selectedMember.credits ?? 0} credit(s) available
                        </Text>
                      </Stack>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={clearSelection}
                        color="accent.600"
                        _hover={{ bg: "accent.100" }}
                        _dark={{ _hover: { bg: "accent.800" } }}
                        disabled={isLoading}
                      >
                        Change
                      </Button>
                    </Stack>
                  </Box>
                ) : (
                  <>
                    <Input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Search by name or email..."
                      borderColor="accent.200"
                      _dark={{ borderColor: "accent.700" }}
                      _hover={{ borderColor: "brand.400" }}
                      _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px #4CA9FF" }}
                      borderRadius="md"
                      fontFamily="body"
                      disabled={isLoading}
                      px={3}
                      py={2}
                      autoComplete="off"
                    />

                    {showDropdown && (
                      <Box
                        position="absolute"
                        top="100%"
                        left={0}
                        right={0}
                        mt={1}
                        bg="white"
                        _dark={{ bg: "accent.800", borderColor: "accent.700" }}
                        borderRadius="md"
                        border="1px solid"
                        borderColor="accent.200"
                        shadow="lg"
                        maxH="300px"
                        overflowY="auto"
                        zIndex={10}
                      >
                        {filteredMembers.length === 0 ? (
                          <Box p={4} textAlign="center">
                            <Text
                              fontSize="sm"
                              color="accent.600"
                              _dark={{ color: "accent.400" }}
                              fontFamily="body"
                            >
                              {members.length === 0 
                                ? 'No active members with credits available'
                                : 'No members found'}
                            </Text>
                          </Box>
                        ) : (
                          filteredMembers.map((member) => (
                            <Box
                              key={member.id}
                              p={3}
                              cursor="pointer"
                              borderBottom="1px solid"
                              borderColor="accent.100"
                              _dark={{ borderColor: "accent.700" }}
                              _hover={{
                                bg: "brand.50",
                                _dark: { bg: "accent.900" }
                              }}
                              onClick={() => handleMemberSelect(member)}
                            >
                              <Stack gap={1}>
                                <Text
                                  fontSize="sm"
                                  fontWeight="600"
                                  color="accent.800"
                                  _dark={{ color: "accent.100" }}
                                  fontFamily="body"
                                >
                                  {member.fullName}
                                </Text>

                                <Text
                                  fontSize="xs"
                                  color="accent.600"
                                  _dark={{ color: "accent.400" }}
                                  fontFamily="body"
                                >
                                  {member.email} • {member.credits ?? 0} credit(s)
                                </Text>
                              </Stack>
                            </Box>
                          ))
                        )}
                      </Box>
                    )}
                  </>
                )}
              </Stack>

              {/* Session Details */}
              <Stack gap={4}>
                <Heading
                  fontSize="md"
                  fontWeight="600"
                  fontFamily="heading"
                  color="accent.800"
                  _dark={{ color: "accent.100" }}
                >
                  Session Details
                </Heading>

                <Stack gap={4}>
                  <Stack gap={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      color="accent.700"
                      _dark={{ color: "accent.300" }}
                      fontFamily="body"
                    >
                      Start Time *
                    </Text>

                    <Input
                      type="datetime-local"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
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
                      End Time (Optional)
                    </Text>

                    <Input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
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

                    <Text
                      fontSize="xs"
                      color="accent.600"
                      _dark={{ color: "accent.400" }}
                      fontFamily="body"
                    >
                      Leave empty if session is ongoing
                    </Text>
                  </Stack>

                  <Stack gap={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      color="accent.700"
                      _dark={{ color: "accent.300" }}
                      fontFamily="body"
                    >
                      Credits to Use *
                    </Text>

                    <Input
                      type="number"
                      required
                      min="1"
                      value={creditsUsed}
                      onChange={(e) => setCreditsUsed(e.target.value)}
                      placeholder="1"
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

                    {selectedMember && (
                      <Text
                        fontSize="xs"
                        color="accent.600"
                        _dark={{ color: "accent.400" }}
                        fontFamily="body"
                      >
                        Member will have {(selectedMember.credits ?? 0) - (parseInt(creditsUsed) || 0)} credit(s) remaining
                      </Text>
                    )}
                  </Stack>

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
                      placeholder="Add any additional notes about this session..."
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
                      minH="100px"
                      resize="vertical"
                      borderWidth="1px"
                      bg="white"
                      {...({} as any)}
                    />
                  </Stack>
                </Stack>
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
                  loadingText="Recording..."
                  px={6}
                  py={3}
                >
                  Record Session
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

