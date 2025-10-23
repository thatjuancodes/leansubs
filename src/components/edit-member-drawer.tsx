import { useState, useEffect } from 'react'
import { Box, Heading, Text, Button, Stack, Input, SimpleGrid } from '@chakra-ui/react'
import { memberService } from '@/services/member.service'
import type { Member, MembershipType, MembershipStatus } from '@/types/member'

interface EditMemberDrawerProps {
  member: Member | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function EditMemberDrawer({ member, isOpen, onClose, onUpdate }: EditMemberDrawerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [membershipType, setMembershipType] = useState<MembershipType | ''>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<MembershipStatus>('active')
  const [notes, setNotes] = useState('')

  // Populate form when member changes
  useEffect(() => {
    if (member) {
      setFullName(member.fullName)
      setEmail(member.email)
      setPhone(member.phone || '')
      setMembershipType(member.membershipType)
      setStartDate(member.startDate)
      setEndDate(member.endDate)
      setStatus(member.status)
      setNotes(member.notes || '')
      setError('')
      setSuccess('')
    }
  }, [member])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!member) return

    if (!membershipType) {
      setError('Please select a membership type')
      return
    }

    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      await memberService.update({
        id: member.id,
        fullName,
        email,
        phone: phone || undefined,
        membershipType: membershipType as MembershipType,
        status,
        startDate,
        endDate,
        notes: notes || undefined,
      })

      setSuccess('Member updated successfully!')
      
      setTimeout(() => {
        onUpdate()
        onClose()
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update member')
    } finally {
      setIsLoading(false)
    }
  }

  function handleClose() {
    setError('')
    setSuccess('')
    onClose()
  }

  if (!isOpen || !member) return null

  return (
    <>
      {/* Backdrop */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        zIndex={999}
        onClick={handleClose}
      />

      {/* Drawer */}
      <Box
        position="fixed"
        top={0}
        right={0}
        bottom={0}
        w={{ base: "full", md: "500px" }}
        bg="white"
        _dark={{ bg: "accent.800" }}
        zIndex={1000}
        boxShadow="xl"
        overflowY="auto"
        css={{
          animation: 'slideInRight 0.3s ease-out',
          '@keyframes slideInRight': {
            from: {
              transform: 'translateX(100%)',
            },
            to: {
              transform: 'translateX(0)',
            },
          },
        }}
      >
        <Box p={6}>
          <Stack gap={6}>
            {/* Header */}
            <Stack direction="row" justify="space-between" align="start">
              <Stack gap={2}>
                <Heading
                  fontSize="2xl"
                  fontWeight="700"
                  fontFamily="heading"
                  color="accent.800"
                  _dark={{ color: "accent.100" }}
                >
                  Edit Member
                </Heading>

                <Text
                  fontSize="sm"
                  color="accent.600"
                  _dark={{ color: "accent.400" }}
                  fontFamily="body"
                >
                  Update member information
                </Text>
              </Stack>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleClose}
                color="accent.600"
                _hover={{ bg: "accent.100" }}
                _dark={{ _hover: { bg: "accent.700" } }}
                fontSize="xl"
                px={2}
              >
                ✕
              </Button>
            </Stack>

            {/* Form */}
            <Box as="form" onSubmit={handleSubmit}>
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
                    fontSize="md"
                    fontWeight="600"
                    fontFamily="heading"
                    color="accent.800"
                    _dark={{ color: "accent.100" }}
                  >
                    Personal Information
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
                        Full Name *
                      </Text>

                      <Input
                        type="text"
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
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as MembershipStatus)}
                        borderColor="accent.200"
                        _dark={{ borderColor: "accent.700" }}
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
                        _dark={{ bg: "accent.900" }}
                      >
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="paused">Paused</option>
                      </Box>
                    </Stack>
                  </Stack>
                </Stack>

                {/* Membership Details */}
                <Stack gap={4}>
                  <Heading
                    fontSize="md"
                    fontWeight="600"
                    fontFamily="heading"
                    color="accent.800"
                    _dark={{ color: "accent.100" }}
                  >
                    Membership Details
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
                        Membership Type *
                      </Text>

                      <Box
                        as="select"
                        required
                        value={membershipType}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMembershipType(e.target.value as MembershipType)}
                        borderColor="accent.200"
                        _dark={{ borderColor: "accent.700" }}
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
                        _dark={{ bg: "accent.900" }}
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
                  </Stack>
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
                    Notes
                  </Text>

                  <Box
                    as="textarea"
                    value={notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                    borderColor="accent.200"
                    _dark={{ borderColor: "accent.700" }}
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
                    _dark={{ bg: "accent.900" }}
                  />
                </Stack>

                {/* Action Buttons */}
                <Stack direction="row" gap={3} pt={4}>
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
                    onClick={handleClose}
                    disabled={isLoading}
                    flex={1}
                    px={4}
                    py={2}
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
                    isLoading={isLoading}
                    loadingText="Updating..."
                    flex={1}
                    px={4}
                    py={2}
                  >
                    Update
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  )
}

