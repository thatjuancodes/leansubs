import { useState } from 'react'
import { Box, Container, Heading, Text, Button, Stack, Input, Link as ChakraLink } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/auth.context'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await register({ name, businessName, email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg="light" _dark={{ bg: "dark" }} display="flex" alignItems="center" py={16}>
      <Container maxW="md" mx="auto" px={{ base: 4, md: 8 }}>
        <Stack gap={8}>
          {/* Logo/Brand */}
          <Stack gap={2} textAlign="center">
            <Heading
              fontSize="4xl"
              fontWeight="700"
              bgGradient="to-r"
              gradientFrom="brand.400"
              gradientTo="secondary.500"
              bgClip="text"
              fontFamily="heading"
            >
              LeanSubs
            </Heading>

            <Text
              fontSize="lg"
              color="accent.600"
              _dark={{ color: "accent.400" }}
              fontFamily="body"
            >
              Create your account
            </Text>
          </Stack>

          {/* Registration Form */}
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
              <Heading
                fontSize="2xl"
                fontWeight="600"
                fontFamily="heading"
                color="accent.800"
                _dark={{ color: "accent.100" }}
              >
                Sign up for LeanSubs
              </Heading>

              <Stack gap={4}>
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

                <Stack gap={2}>
                  <Text
                    fontSize="sm"
                    fontWeight="500"
                    color="accent.700"
                    _dark={{ color: "accent.300" }}
                    fontFamily="body"
                  >
                    Full Name
                  </Text>

                  <Input
                    type="text"
                    placeholder="John Doe"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    Business Name
                  </Text>

                  <Input
                    type="text"
                    placeholder="Acme Fitness"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
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
                    Email
                  </Text>

                  <Input
                    type="email"
                    placeholder="you@example.com"
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
                    Password
                  </Text>

                  <Input
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                  <Text fontSize="xs" color="accent.500" fontFamily="body">
                    Must be at least 8 characters
                  </Text>
                </Stack>
              </Stack>

              <Stack gap={4}>
                <Button
                  type="submit"
                  size="lg"
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
                  w="full"
                  isLoading={isLoading}
                  loadingText="Creating account..."
                  px={6}
                  py={3}
                >
                  Create account
                </Button>

                <Text
                  fontSize="sm"
                  textAlign="center"
                  color="accent.600"
                  _dark={{ color: "accent.400" }}
                  fontFamily="body"
                >
                  Already have an account?{' '}
                  <ChakraLink
                    as={Link}
                    to="/login"
                    color="brand.400"
                    fontWeight="600"
                    _hover={{ color: "brand.500", textDecoration: "underline" }}
                  >
                    Sign in
                  </ChakraLink>
                </Text>
              </Stack>
            </Stack>
          </Box>

          {/* Back to Home */}
          <Text textAlign="center">
            <ChakraLink
              as={Link}
              to="/"
              color="accent.600"
              _dark={{ color: "accent.400" }}
              fontSize="sm"
              fontFamily="body"
              _hover={{ color: "brand.400" }}
            >
              ← Back to home
            </ChakraLink>
          </Text>
        </Stack>
      </Container>
    </Box>
  )
}

