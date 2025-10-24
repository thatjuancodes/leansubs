import { useState, useEffect } from 'react'
import { Box, Heading, Text, Button, Stack, Input } from '@chakra-ui/react'
import { memberService } from '@/services/member.service'
import type { Member } from '@/types/member'

interface DeleteMemberModalProps {
  member: Member | null
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
}

export function DeleteMemberModal({ member, isOpen, onClose, onDelete }: DeleteMemberModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmationText, setConfirmationText] = useState('')

  useEffect(() => {
    if (isOpen) {
      setConfirmationText('')
      setError('')
    }
  }, [isOpen])

  async function handleDelete() {
    if (!member) return

    if (confirmationText !== member.fullName) {
      setError(`Please type "${member.fullName}" to confirm deletion`)
      return
    }

    setError('')
    setIsLoading(true)

    try {
      await memberService.delete(member.id)
      onDelete()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete member')
    } finally {
      setIsLoading(false)
    }
  }

  function handleClose() {
    if (!isLoading) {
      setConfirmationText('')
      setError('')
      onClose()
    }
  }

  if (!isOpen || !member) return null

  const isConfirmationMatch = confirmationText === member.fullName

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
        zIndex={1001}
        onClick={handleClose}
      />

      {/* Modal */}
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w={{ base: "90%", md: "500px" }}
        bg="white"
        _dark={{ bg: "accent.800" }}
        zIndex={1002}
        boxShadow="xl"
        borderRadius="lg"
        p={6}
        css={{
          animation: 'fadeInScale 0.2s ease-out',
          '@keyframes fadeInScale': {
            from: {
              opacity: 0,
              transform: 'translate(-50%, -50%) scale(0.95)',
            },
            to: {
              opacity: 1,
              transform: 'translate(-50%, -50%) scale(1)',
            },
          },
        }}
      >
        <Stack gap={6}>
          {/* Header */}
          <Stack gap={3}>
            <Stack direction="row" align="center" gap={3}>
              <Box fontSize="2xl">⚠️</Box>

              <Heading
                fontSize="xl"
                fontWeight="700"
                fontFamily="heading"
                color="danger.600"
                _dark={{ color: "danger.400" }}
              >
                Delete Member
              </Heading>
            </Stack>

            <Text
              fontSize="sm"
              color="accent.600"
              _dark={{ color: "accent.400" }}
              fontFamily="body"
            >
              This action cannot be undone. This will permanently delete the member record.
            </Text>
          </Stack>

          {/* Member Info */}
          <Box
            bg="accent.50"
            _dark={{ bg: "accent.900", borderColor: "accent.700" }}
            p={4}
            borderRadius="md"
            border="1px solid"
            borderColor="accent.200"
          >
            <Stack gap={2}>
              <Text
                fontSize="md"
                fontWeight="600"
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
                {member.email}
              </Text>

              <Text
                fontSize="sm"
                color="accent.600"
                _dark={{ color: "accent.400" }}
                fontFamily="body"
              >
                {member.membershipType}
              </Text>
            </Stack>
          </Box>

          {/* Confirmation Input */}
          <Stack gap={3}>
            <Text
              fontSize="sm"
              fontWeight="500"
              color="accent.700"
              _dark={{ color: "accent.300" }}
              fontFamily="body"
            >
              Type <Text as="span" fontWeight="700" color="danger.600" _dark={{ color: "danger.400" }}>"{member.fullName}"</Text> to confirm:
            </Text>

            <Input
              type="text"
              value={confirmationText}
              onChange={(e) => {
                setConfirmationText(e.target.value)
                setError('')
              }}
              placeholder={member.fullName}
              borderColor="accent.200"
              _dark={{ borderColor: "accent.700" }}
              _hover={{ borderColor: "danger.400" }}
              _focus={{ borderColor: "danger.400", boxShadow: "0 0 0 1px #F87171" }}
              borderRadius="md"
              fontFamily="body"
              disabled={isLoading}
              px={3}
              py={2}
              autoFocus
            />
          </Stack>

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

          {/* Action Buttons */}
          <Stack direction="row" gap={3}>
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
              type="button"
              backgroundColor={isConfirmationMatch ? "danger.500" : "accent.300"}
              color="white"
              _hover={isConfirmationMatch ? {
                bg: "danger.600",
                transform: "translateY(-2px)",
                shadow: "lg"
              } : {}}
              borderRadius="md"
              fontWeight="600"
              transition="all 0.2s ease-in-out"
              loading={isLoading}
              loadingText="Deleting..."
              onClick={handleDelete}
              disabled={!isConfirmationMatch || isLoading}
              flex={1}
              px={4}
              py={2}
              cursor={isConfirmationMatch ? "pointer" : "not-allowed"}
            >
              Delete Member
            </Button>
          </Stack>
        </Stack>
      </Box>
    </>
  )
}

