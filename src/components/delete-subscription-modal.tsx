import { useState } from 'react'
import { Box, Heading, Text, Button, Stack, Input } from '@chakra-ui/react'
import { DialogRoot, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogBackdrop } from '@chakra-ui/react'
import type { Subscription } from '@/types/subscription'

interface DeleteSubscriptionModalProps {
  subscription: Subscription | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (password: string) => Promise<void>
}

export function DeleteSubscriptionModal({
  subscription,
  isOpen,
  onClose,
  onConfirm,
}: DeleteSubscriptionModalProps) {
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  function handleClose() {
    if (!isLoading) {
      setPassword('')
      setError('')
      onClose()
    }
  }

  async function handleConfirm() {
    if (!password) {
      setError('Please enter your password')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await onConfirm(password)
      setPassword('')
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subscription')
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !isLoading) {
      handleConfirm()
    }
  }

  if (!subscription) return null

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && handleClose()}>
      <DialogBackdrop />
      <DialogContent
        maxW="md"
        bg="white"
        _dark={{ bg: "accent.800" }}
        borderRadius="lg"
        shadow="xl"
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        p={6}
      >
        <DialogHeader pb={4}>
          <Heading
            fontSize="xl"
            fontWeight="600"
            fontFamily="heading"
            color="accent.800"
            _dark={{ color: "accent.100" }}
          >
            Delete Subscription
          </Heading>
        </DialogHeader>

        <DialogBody py={4}>
          <Stack gap={4}>
            {/* Warning Message */}
            <Box
              bg="danger.50"
              _dark={{ bg: "danger.900" }}
              border="1px solid"
              borderColor="danger.400"
              borderRadius="md"
              p={4}
            >
              <Text
                fontSize="sm"
                color="danger.700"
                _dark={{ color: "danger.200" }}
                fontFamily="body"
                fontWeight="500"
              >
                ⚠️ Warning: This action cannot be undone!
              </Text>
            </Box>

            {/* Subscription Details */}
            <Stack gap={2}>
              <Text
                fontSize="md"
                color="accent.700"
                _dark={{ color: "accent.300" }}
                fontFamily="body"
              >
                You are about to delete the following subscription:
              </Text>

              <Box
                bg="accent.50"
                _dark={{ bg: "accent.900" }}
                p={4}
                borderRadius="md"
                border="1px solid"
                borderColor="accent.200"
                _dark={{ borderColor: "accent.700" }}
              >
                <Stack gap={2}>
                  <Text
                    fontSize="sm"
                    color="accent.600"
                    _dark={{ color: "accent.400" }}
                    fontFamily="body"
                  >
                    <strong>Member:</strong> {subscription.memberName}
                  </Text>

                  <Text
                    fontSize="sm"
                    color="accent.600"
                    _dark={{ color: "accent.400" }}
                    fontFamily="body"
                  >
                    <strong>Amount:</strong> ${subscription.amount.toFixed(2)}
                  </Text>

                  <Text
                    fontSize="sm"
                    color="accent.600"
                    _dark={{ color: "accent.400" }}
                    fontFamily="body"
                  >
                    <strong>Credits:</strong> {subscription.credits}
                  </Text>

                  <Text
                    fontSize="sm"
                    color="accent.600"
                    _dark={{ color: "accent.400" }}
                    fontFamily="body"
                  >
                    <strong>Date:</strong> {new Date(subscription.createdAt).toLocaleDateString()}
                  </Text>
                </Stack>
              </Box>
            </Stack>

            {/* Important Note */}
            <Box
              bg="warning.50"
              _dark={{ bg: "warning.900" }}
              border="1px solid"
              borderColor="warning.400"
              borderRadius="md"
              p={3}
            >
              <Text
                fontSize="sm"
                color="warning.700"
                _dark={{ color: "warning.200" }}
                fontFamily="body"
              >
                <strong>Note:</strong> Deleting this subscription will NOT remove the credits from the member's account. This only removes the payment record.
              </Text>
            </Box>

            {/* Password Confirmation */}
            <Stack gap={2}>
              <Text
                fontSize="sm"
                fontWeight="500"
                color="accent.700"
                _dark={{ color: "accent.300" }}
                fontFamily="body"
              >
                Enter your password to confirm:
              </Text>

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                borderColor="accent.200"
                _dark={{ borderColor: "accent.700" }}
                _hover={{ borderColor: "brand.400" }}
                _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px #4CA9FF" }}
                borderRadius="md"
                fontFamily="body"
                disabled={isLoading}
                autoFocus
                px={4}
                py={3}
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
          </Stack>
        </DialogBody>

        <DialogFooter pt={4}>
          <Stack direction="row" gap={3} w="full">
            <Button
              variant="outline"
              borderColor="accent.200"
              color="accent.700"
              _hover={{ bg: "accent.50" }}
              _dark={{
                borderColor: "accent.700",
                color: "accent.300",
                _hover: { bg: "accent.900" }
              }}
              onClick={handleClose}
              disabled={isLoading}
              flex={1}
              px={5}
            >
              Cancel
            </Button>

            <Button
              bg="danger.500"
              color="white"
              _hover={{ bg: "danger.600" }}
              onClick={handleConfirm}
              isLoading={isLoading}
              loadingText="Deleting..."
              flex={1}
              px={5}
            >
              Delete Subscription
            </Button>
          </Stack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}

