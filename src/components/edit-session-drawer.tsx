import { useState, useEffect } from 'react'
import { Box, Heading, Text, Button, Stack, Input } from '@chakra-ui/react'
import { sessionService } from '@/services/session.service'
import type { SessionWithMember, SessionStatus } from '@/types/session'

interface EditSessionDrawerProps {
  session: SessionWithMember | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function EditSessionDrawer({ session, isOpen, onClose, onUpdate }: EditSessionDrawerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [creditsUsed, setCreditsUsed] = useState('')
  const [status, setStatus] = useState<SessionStatus>('unverified')
  const [notes, setNotes] = useState('')

  // Populate form when session changes
  useEffect(() => {
    if (session) {
      // Convert ISO to datetime-local format
      const start = new Date(session.startTime || session.timestamp)
      const startLocal = new Date(start.getTime() - start.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
      setStartTime(startLocal)

      if (session.endTime) {
        const end = new Date(session.endTime)
        const endLocal = new Date(end.getTime() - end.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)
        setEndTime(endLocal)
      } else {
        setEndTime('')
      }

      setCreditsUsed(session.creditsUsed.toString())
      setStatus(session.status)
      setNotes(session.notes || '')
      setError('')
      setSuccess('')
    }
  }, [session])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!session) return

    const creditsNum = parseInt(creditsUsed) || 1
    if (creditsNum < 1) {
      setError('Credits used must be at least 1')
      return
    }

    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      await sessionService.update({
        id: session.id,
        startTime: new Date(startTime).toISOString(),
        endTime: endTime ? new Date(endTime).toISOString() : undefined,
        creditsUsed: creditsNum,
        status,
        notes: notes || undefined,
      }, session.userId)

      setSuccess('Session updated successfully!')
      
      setTimeout(() => {
        onUpdate()
        onClose()
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update session')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleEndSession() {
    if (!session) return

    setIsLoading(true)
    setError('')

    try {
      const now = new Date()
      const nowLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
      
      setEndTime(nowLocal)
      setSuccess('End time set to now. Click Update to save.')
    } catch (err) {
      setError('Failed to set end time')
    } finally {
      setIsLoading(false)
    }
  }

  function handleClose() {
    setError('')
    setSuccess('')
    onClose()
  }

  if (!isOpen || !session) return null

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
                  Edit Session
                </Heading>

                <Text
                  fontSize="sm"
                  color="accent.600"
                  _dark={{ color: "accent.400" }}
                  fontFamily="body"
                >
                  Update session details for {session.memberName}
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

                {/* Member Info */}
                <Box
                  bg="brand.50"
                  _dark={{ bg: "brand.900", borderColor: "brand.700" }}
                  p={4}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="brand.200"
                >
                  <Stack gap={1}>
                    <Text
                      fontSize="md"
                      fontWeight="600"
                      color="accent.800"
                      _dark={{ color: "accent.100" }}
                      fontFamily="body"
                    >
                      {session.memberName}
                    </Text>

                    <Text
                      fontSize="sm"
                      color="accent.600"
                      _dark={{ color: "accent.400" }}
                      fontFamily="body"
                    >
                      {session.memberEmail}
                    </Text>
                  </Stack>
                </Box>

                {/* Time Fields */}
                <Stack gap={4}>
                  <Heading
                    fontSize="md"
                    fontWeight="600"
                    fontFamily="heading"
                    color="accent.800"
                    _dark={{ color: "accent.100" }}
                  >
                    Session Time
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
                      <Stack direction="row" justify="space-between" align="center">
                        <Text
                          fontSize="sm"
                          fontWeight="500"
                          color="accent.700"
                          _dark={{ color: "accent.300" }}
                          fontFamily="body"
                        >
                          End Time (Optional)
                        </Text>

                        {!endTime && (
                          <Button
                            size="xs"
                            backgroundColor="brand.400"
                            color="white"
                            _hover={{ bg: "brand.500" }}
                            onClick={handleEndSession}
                            disabled={isLoading}
                            px={3}
                            py={1}
                            borderRadius="md"
                            fontWeight="600"
                          >
                            End Now
                          </Button>
                        )}
                      </Stack>

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
                        {endTime ? 'Session has ended' : 'Session is ongoing'}
                      </Text>
                    </Stack>
                  </Stack>
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
                        Credits Used *
                      </Text>

                      <Input
                        type="number"
                        required
                        min="1"
                        value={creditsUsed}
                        onChange={(e) => setCreditsUsed(e.target.value)}
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
                        onChange={(e) => setStatus((e.target as HTMLSelectElement).value as SessionStatus)}
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
                        <option value="unverified">Unverified</option>
                        <option value="verified">Verified</option>
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
                        Notes
                      </Text>

                      <Box
                        as="textarea"
                        value={notes}
                        onChange={(e) => setNotes((e.target as HTMLTextAreaElement).value)}
                        placeholder="Add any notes about this session..."
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
                      loading={isLoading}
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

