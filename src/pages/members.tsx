import { useState, useEffect } from 'react'
import { Box, Container, Heading, Text, Button, Stack, Badge, Input } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/auth.context'
import { memberService } from '@/services/member.service'
import { EditMemberDrawer } from '@/components/edit-member-drawer'
import type { Member } from '@/types/member'

export function MembersPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    loadMembers()
  }, [user])

  async function loadMembers() {
    if (!user) return

    try {
      const data = await memberService.getAll(user.id)
      setMembers(data)
    } catch (error) {
      console.error('Failed to load members:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  function handleMemberClick(member: Member) {
    setSelectedMember(member)
    setIsDrawerOpen(true)
  }

  function handleDrawerClose() {
    setIsDrawerOpen(false)
    setSelectedMember(null)
  }

  function handleMemberUpdate() {
    loadMembers() // Refresh the list
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'success.500'
      case 'expired':
        return 'danger.400'
      case 'cancelled':
        return 'danger.400'
      case 'paused':
        return 'warning.300'
      default:
        return 'accent.500'
    }
  }

  function getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const filteredMembers = members.filter(member =>
    member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              cursor="pointer"
              onClick={() => navigate('/dashboard')}
            >
              LeanSubs
            </Heading>

            <Stack direction="row" gap={4} align="center">
              <Text
                fontSize="sm"
                color="accent.600"
                _dark={{ color: "accent.400" }}
                fontFamily="body"
                display={{ base: "none", md: "block" }}
              >
                {user?.businessName}
              </Text>

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
          </Stack>
        </Container>
      </Box>

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
                Members
              </Heading>

              <Text
                fontSize="md"
                color="accent.600"
                _dark={{ color: "accent.400" }}
                fontFamily="body"
              >
                {isLoading ? 'Loading...' : `${filteredMembers.length} member${filteredMembers.length !== 1 ? 's' : ''}`}
              </Text>
            </Stack>

            <Button
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
              onClick={() => navigate('/members/add')}
              px={6}
              py={3}
            >
              + Add Member
            </Button>
          </Stack>

          {/* Search */}
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            borderColor="accent.200"
            _dark={{ borderColor: "accent.700" }}
            _hover={{ borderColor: "brand.400" }}
            _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px #4CA9FF" }}
            borderRadius="md"
            fontFamily="body"
            px={3}
            py={2}
            size="lg"
          />

          {/* Members List */}
          {isLoading ? (
            <Box textAlign="center" py={12}>
              <Text color="accent.600" _dark={{ color: "accent.400" }} fontFamily="body">
                Loading members...
              </Text>
            </Box>
          ) : filteredMembers.length === 0 ? (
            <Box
              bg="white"
              _dark={{ bg: "accent.800" }}
              p={12}
              borderRadius="md"
              border="subtle"
              shadow="base"
              textAlign="center"
            >
              <Stack gap={4} align="center">
                <Text fontSize="4xl">📋</Text>

                <Heading
                  fontSize="xl"
                  fontWeight="600"
                  fontFamily="heading"
                  color="accent.800"
                  _dark={{ color: "accent.100" }}
                >
                  {searchQuery ? 'No members found' : 'No members yet'}
                </Heading>

                <Text
                  color="accent.600"
                  _dark={{ color: "accent.400" }}
                  fontFamily="body"
                >
                  {searchQuery ? 'Try adjusting your search terms' : 'Get started by adding your first member'}
                </Text>

                {!searchQuery && (
                  <Button
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
                    onClick={() => navigate('/members/add')}
                    px={6}
                    py={3}
                    mt={4}
                  >
                    Add First Member
                  </Button>
                )}
              </Stack>
            </Box>
          ) : (
            <Box
              bg="white"
              _dark={{ bg: "accent.800" }}
              borderRadius="md"
              border="subtle"
              shadow="base"
              overflow="hidden"
            >
              <Box overflowX="auto">
                <Box
                  as="table"
                  w="full"
                  css={{
                    borderCollapse: 'collapse',
                    '& th': { textAlign: 'left' },
                    '& td': { textAlign: 'left' },
                  }}
                >
                  <Box as="thead" bg="accent.50" _dark={{ bg: "accent.900" }}>
                    <Box as="tr">
                      <Box
                        as="th"
                        px={6}
                        py={4}
                        fontFamily="heading"
                        fontSize="sm"
                        fontWeight="600"
                        color="accent.700"
                        _dark={{ color: "accent.300" }}
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Name
                      </Box>
                      <Box
                        as="th"
                        px={6}
                        py={4}
                        fontFamily="heading"
                        fontSize="sm"
                        fontWeight="600"
                        color="accent.700"
                        _dark={{ color: "accent.300" }}
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Email
                      </Box>
                      <Box
                        as="th"
                        px={6}
                        py={4}
                        fontFamily="heading"
                        fontSize="sm"
                        fontWeight="600"
                        color="accent.700"
                        _dark={{ color: "accent.300" }}
                        textTransform="uppercase"
                        letterSpacing="wide"
                        display={{ base: "none", md: "table-cell" }}
                      >
                        Phone
                      </Box>
                      <Box
                        as="th"
                        px={6}
                        py={4}
                        fontFamily="heading"
                        fontSize="sm"
                        fontWeight="600"
                        color="accent.700"
                        _dark={{ color: "accent.300" }}
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Membership
                      </Box>
                      <Box
                        as="th"
                        px={6}
                        py={4}
                        fontFamily="heading"
                        fontSize="sm"
                        fontWeight="600"
                        color="accent.700"
                        _dark={{ color: "accent.300" }}
                        textTransform="uppercase"
                        letterSpacing="wide"
                        display={{ base: "none", lg: "table-cell" }}
                      >
                        End Date
                      </Box>
                      <Box
                        as="th"
                        px={6}
                        py={4}
                        fontFamily="heading"
                        fontSize="sm"
                        fontWeight="600"
                        color="accent.700"
                        _dark={{ color: "accent.300" }}
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Credits
                      </Box>
                      <Box
                        as="th"
                        px={6}
                        py={4}
                        fontFamily="heading"
                        fontSize="sm"
                        fontWeight="600"
                        color="accent.700"
                        _dark={{ color: "accent.300" }}
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Status
                      </Box>
                    </Box>
                  </Box>
                  <Box as="tbody">
                    {filteredMembers.map((member) => (
                      <MemberRow 
                        key={member.id} 
                        member={member} 
                        getStatusColor={getStatusColor} 
                        getStatusLabel={getStatusLabel}
                        onClick={() => handleMemberClick(member)}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Stack>
      </Container>

      {/* Edit Member Drawer */}
      <EditMemberDrawer
        member={selectedMember}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onUpdate={handleMemberUpdate}
      />
    </Box>
  )
}

interface MemberRowProps {
  member: Member
  getStatusColor: (status: string) => string
  getStatusLabel: (status: string) => string
  onClick: () => void
}

function MemberRow({ member, getStatusColor, getStatusLabel, onClick }: MemberRowProps) {
  function formatMembershipType(type: string): string {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <Box
      as="tr"
      borderTop="subtle"
      transition="all 0.2s ease-in-out"
      cursor="pointer"
      onClick={onClick}
      _hover={{
        bg: "accent.50",
        _dark: { bg: "accent.900" }
      }}
    >
      {/* Name */}
      <Box
        as="td"
        px={6}
        py={4}
        fontFamily="body"
        fontSize="sm"
        fontWeight="500"
        color="accent.800"
        _dark={{ color: "accent.100" }}
      >
        {member.fullName}
      </Box>

      {/* Email */}
      <Box
        as="td"
        px={6}
        py={4}
        fontFamily="body"
        fontSize="sm"
        color="accent.600"
        _dark={{ color: "accent.400" }}
      >
        {member.email}
      </Box>

      {/* Phone */}
      <Box
        as="td"
        px={6}
        py={4}
        fontFamily="body"
        fontSize="sm"
        color="accent.600"
        _dark={{ color: "accent.400" }}
        display={{ base: "none", md: "table-cell" }}
      >
        {member.phone || '—'}
      </Box>

      {/* Membership Type */}
      <Box
        as="td"
        px={6}
        py={4}
        fontFamily="body"
        fontSize="sm"
        color="accent.700"
        _dark={{ color: "accent.300" }}
      >
        {formatMembershipType(member.membershipType)}
      </Box>

      {/* End Date */}
      <Box
        as="td"
        px={6}
        py={4}
        fontFamily="body"
        fontSize="sm"
        color="accent.600"
        _dark={{ color: "accent.400" }}
        display={{ base: "none", lg: "table-cell" }}
      >
        {new Date(member.endDate).toLocaleDateString()}
      </Box>

      {/* Credits */}
      <Box
        as="td"
        px={6}
        py={4}
        fontFamily="body"
        fontSize="sm"
        fontWeight="600"
        color={(member.credits ?? 0) > 0 ? "success.600" : "danger.600"}
        _dark={{ color: (member.credits ?? 0) > 0 ? "success.400" : "danger.400" }}
      >
        {member.credits ?? 0}
      </Box>

      {/* Status */}
      <Box
        as="td"
        px={6}
        py={4}
      >
        <Badge
          backgroundColor={getStatusColor(member.status)}
          color="white"
          px={3}
          py={1}
          borderRadius="md"
          fontSize="xs"
        >
          {getStatusLabel(member.status)}
        </Badge>
      </Box>
    </Box>
  )
}

