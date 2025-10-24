import { useState, useEffect } from 'react'
import { Box, Container, Heading, Text, Button, Stack, Badge, Input } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/auth.context'
import { sessionService } from '@/services/session.service'
import { EditSessionDrawer } from '@/components/edit-session-drawer'
import type { SessionWithMember } from '@/types/session'

export function SessionsPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [sessions, setSessions] = useState<SessionWithMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'unverified' | 'verified'>('all')
  const [selectedSession, setSelectedSession] = useState<SessionWithMember | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    loadSessions()
  }, [user])

  async function loadSessions() {
    if (!user) return

    try {
      const data = await sessionService.getAll(user.id)
      setSessions(data)
    } catch (error) {
      console.error('Failed to load sessions:', error)
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

  async function handleVerify(sessionId: string, event?: React.MouseEvent) {
    if (event) {
      event.stopPropagation() // Prevent card click
    }
    
    if (!user) return

    try {
      await sessionService.verify(sessionId, user.id)
      await loadSessions() // Refresh the list
    } catch (error) {
      console.error('Failed to verify session:', error)
    }
  }

  function handleSessionClick(session: SessionWithMember) {
    setSelectedSession(session)
    setIsDrawerOpen(true)
  }

  function handleDrawerClose() {
    setIsDrawerOpen(false)
    setSelectedSession(null)
  }

  function handleSessionUpdate() {
    loadSessions() // Refresh the list
  }

  function getStatusColor(status: string): string {
    return status === 'verified' ? 'success.500' : 'warning.400'
  }

  function getStatusLabel(status: string): string {
    return status === 'verified' ? 'Verified' : 'Unverified'
  }

  function formatTime(isoString: string): string {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  function formatDuration(startTime: string, endTime?: string): string {
    if (!endTime) return 'Ongoing'
    
    const start = new Date(startTime)
    const end = new Date(endTime)
    const durationMs = end.getTime() - start.getTime()
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const filteredSessions = sessions.filter(session => {
    // Filter by status
    if (statusFilter !== 'all' && session.status !== statusFilter) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        session.memberName.toLowerCase().includes(query) ||
        session.memberEmail.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Group sessions by date
  const groupedSessions: Record<string, SessionWithMember[]> = {}
  filteredSessions.forEach(session => {
    const sessionDate = new Date(session.startTime || session.timestamp)
    const dateKey = sessionDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    
    if (!groupedSessions[dateKey]) {
      groupedSessions[dateKey] = []
    }
    groupedSessions[dateKey].push(session)
  })

  // Sort groups by date (most recent first) and sessions within each group
  const sortedDateKeys = Object.keys(groupedSessions).sort((a, b) => {
    const dateA = new Date(groupedSessions[a][0].startTime || groupedSessions[a][0].timestamp)
    const dateB = new Date(groupedSessions[b][0].startTime || groupedSessions[b][0].timestamp)
    return dateB.getTime() - dateA.getTime()
  })

  // Sort sessions within each group (most recent first)
  sortedDateKeys.forEach(dateKey => {
    groupedSessions[dateKey].sort((a, b) => {
      const timeA = new Date(a.startTime || a.timestamp).getTime()
      const timeB = new Date(b.startTime || b.timestamp).getTime()
      return timeB - timeA
    })
  })

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
                Sessions
              </Heading>

              <Text
                fontSize="md"
                color="accent.600"
                _dark={{ color: "accent.400" }}
                fontFamily="body"
              >
                {isLoading ? 'Loading...' : `${filteredSessions.length} session${filteredSessions.length !== 1 ? 's' : ''}`}
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
              onClick={() => navigate('/sessions/add')}
              px={6}
              py={3}
            >
              + Record Session
            </Button>
          </Stack>

          {/* Filters */}
          <Stack direction={{ base: "column", md: "row" }} gap={4}>
            {/* Search */}
            <Input
              placeholder="Search by member name or email..."
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
              flex={1}
            />

            {/* Status Filter */}
            <Box
              as="select"
              value={statusFilter}
              onChange={(e) => 
                setStatusFilter((e.target as HTMLSelectElement).value as 'all' | 'unverified' | 'verified')
              }
              borderColor="accent.200"
              _dark={{ borderColor: "accent.700", bg: "accent.900" }}
              _hover={{ borderColor: "brand.400" }}
              _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px #4CA9FF" }}
              borderRadius="md"
              fontFamily="body"
              px={3}
              py={2}
              h="auto"
              borderWidth="1px"
              bg="white"
              w={{ base: "full", md: "200px" }}
              {...({} as any)}
            >
              <option value="all">All Sessions</option>
              <option value="unverified">Unverified</option>
              <option value="verified">Verified</option>
            </Box>
          </Stack>

          {/* Sessions List */}
          {isLoading ? (
            <Box textAlign="center" py={12}>
              <Text color="accent.600" _dark={{ color: "accent.400" }} fontFamily="body">
                Loading sessions...
              </Text>
            </Box>
          ) : filteredSessions.length === 0 ? (
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
                <Text fontSize="4xl">📅</Text>

                <Heading
                  fontSize="xl"
                  fontWeight="600"
                  fontFamily="heading"
                  color="accent.800"
                  _dark={{ color: "accent.100" }}
                >
                  {searchQuery || statusFilter !== 'all' ? 'No sessions found' : 'No sessions yet'}
                </Heading>

                <Text
                  color="accent.600"
                  _dark={{ color: "accent.400" }}
                  fontFamily="body"
                >
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Get started by recording your first session'}
                </Text>

                {!searchQuery && statusFilter === 'all' && (
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
                    onClick={() => navigate('/sessions/add')}
                    px={6}
                    py={3}
                    mt={4}
                  >
                    Record First Session
                  </Button>
                )}
              </Stack>
            </Box>
          ) : (
            <Stack gap={6}>
              {sortedDateKeys.map(dateKey => (
                <Stack key={dateKey} gap={4}>
                  {/* Date Header */}
                  <Heading
                    fontSize="lg"
                    fontWeight="600"
                    fontFamily="heading"
                    color="accent.700"
                    _dark={{ color: "accent.300" }}
                  >
                    {dateKey}
                  </Heading>

                  {/* Sessions for this date */}
                  <Stack gap={3}>
                    {groupedSessions[dateKey].map(session => (
                      <Box
                        key={session.id}
                        bg="white"
                        _dark={{ bg: "accent.800" }}
                        p={4}
                        borderRadius="md"
                        border="subtle"
                        shadow="sm"
                        transition="all 0.2s ease-in-out"
                        cursor="pointer"
                        onClick={() => handleSessionClick(session)}
                        _hover={{
                          shadow: "md",
                          transform: "translateY(-1px)",
                          borderColor: "brand.400"
                        }}
                      >
                        <Stack direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "stretch", md: "center" }} gap={3}>
                          {/* Member Info & Time */}
                          <Stack gap={2} flex={1}>
                            <Stack direction="row" align="center" gap={3}>
                              <Text
                                fontSize="md"
                                fontWeight="600"
                                color="accent.800"
                                _dark={{ color: "accent.100" }}
                                fontFamily="body"
                              >
                                {session.memberName}
                              </Text>

                              <Badge
                                backgroundColor={getStatusColor(session.status)}
                                color="white"
                                px={2}
                                py={1}
                                borderRadius="md"
                                fontSize="xs"
                              >
                                {getStatusLabel(session.status)}
                              </Badge>
                            </Stack>

                            <Stack direction="row" gap={4} fontSize="sm" color="accent.600" _dark={{ color: "accent.400" }}>
                              <Text fontFamily="body">
                                🕐 {formatTime(session.startTime || session.timestamp)}
                                {session.endTime && ` - ${formatTime(session.endTime)}`}
                              </Text>

                              <Text fontFamily="body">
                                ⏱️ {formatDuration(session.startTime || session.timestamp, session.endTime)}
                              </Text>

                              <Text fontFamily="body">
                                💳 {session.creditsUsed} credit{session.creditsUsed !== 1 ? 's' : ''}
                              </Text>
                            </Stack>

                            {session.notes && (
                              <Text
                                fontSize="sm"
                                color="accent.600"
                                _dark={{ color: "accent.400" }}
                                fontFamily="body"
                                fontStyle="italic"
                              >
                                "{session.notes}"
                              </Text>
                            )}
                          </Stack>

                          {/* Action */}
                          {session.status === 'unverified' && (
                            <Button
                              size="sm"
                              backgroundColor="success.500"
                              color="white"
                              _hover={{
                                bg: "success.600"
                              }}
                              onClick={(e) => handleVerify(session.id, e)}
                              px={4}
                              py={2}
                              borderRadius="md"
                              fontWeight="600"
                              fontSize="sm"
                            >
                              ✓ Verify
                            </Button>
                          )}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Container>

      {/* Edit Session Drawer */}
      <EditSessionDrawer
        session={selectedSession}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onUpdate={handleSessionUpdate}
      />
    </Box>
  )
}
