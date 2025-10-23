import { Box, Container, Heading, Text, Button, Stack, Flex, SimpleGrid } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

export function LandingPage() {
  const navigate = useNavigate()
  return (
    <Box minH="100vh" bg="light" _dark={{ bg: "dark" }}>
      {/* Hero Section */}
      <Container maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }} pt={{ base: 20, md: 32 }} pb={{ base: 16, md: 24 }}>
        <Stack gap={8} align="center" textAlign="center">
          <Heading
            fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
            fontWeight="700"
            lineHeight="shorter"
            bgGradient="to-r"
            gradientFrom="brand.400"
            gradientTo="secondary.500"
            bgClip="text"
            fontFamily="heading"
          >
            LeanSubs
          </Heading>

          <Text
            fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
            color="accent.700"
            _dark={{ color: "accent.300" }}
            maxW="3xl"
            fontWeight="600"
            fontFamily="heading"
          >
            Subscription Management Made Simple
          </Text>

          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color="accent.600"
            _dark={{ color: "accent.400" }}
            maxW="2xl"
            fontFamily="body"
            lineHeight="tall"
          >
            The all-in-one platform for gym owners and subscription-based businesses 
            to effortlessly track memberships, monitor sessions, and manage member progress.
          </Text>

          <Flex gap={4} flexDir={{ base: "column", sm: "row" }} mt={4}>
            <Button
              size="lg"
              backgroundColor="brand.400"
              color="white"
              _hover={{ 
                bg: "brand.500",
                transform: "translateY(-2px)",
                shadow: "lg"
              }}
              px={8}
              py={3}
              fontSize="lg"
              borderRadius="md"
              fontWeight="600"
              transition="all 0.2s ease-in-out"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>

            <Button
              size="lg"
              variant="outline"
              borderColor="accent.200"
              color="accent.700"
              _hover={{ 
                bg: "white",
                borderColor: "brand.400",
                color: "brand.400",
                transform: "translateY(-2px)",
                shadow: "md"
              }}
              _dark={{ 
                borderColor: "accent.700",
                color: "accent.300",
                _hover: { 
                  bg: "accent.800",
                  borderColor: "brand.400",
                  color: "brand.400"
                } 
              }}
              px={8}
              py={3}
              fontSize="lg"
              borderRadius="md"
              fontWeight="600"
              transition="all 0.2s ease-in-out"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </Flex>
        </Stack>
      </Container>

      {/* Features Section */}
      <Container maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }} py={{ base: 16, md: 24 }}>
        <Stack gap={12}>
          <Stack gap={4} textAlign="center">
            <Heading
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="700"
              fontFamily="heading"
              color="accent.800"
              _dark={{ color: "accent.100" }}
            >
              Everything You Need
            </Heading>

            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="accent.600"
              _dark={{ color: "accent.400" }}
              fontFamily="body"
            >
              Powerful features designed for subscription-based businesses
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            <FeatureCard
              title="Subscription Tracking"
              description="Easily manage and monitor all your customer subscriptions in one place. Track renewals, cancellations, and payment statuses effortlessly."
              icon="📊"
              accentColor="brand.400"
            />

            <FeatureCard
              title="Session Management"
              description="Keep track of member attendance and sessions. Know exactly who's coming in and how frequently they're using your services."
              icon="📅"
              accentColor="secondary.500"
            />

            <FeatureCard
              title="Member Progress"
              description="Document member progress, experiences, and achievements. Build stronger relationships by remembering what matters."
              icon="📈"
              accentColor="success.500"
            />
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: string
  accentColor: string
}

function FeatureCard({ title, description, icon, accentColor }: FeatureCardProps) {
  return (
    <Box
      p={8}
      bg="white"
      _dark={{ bg: "accent.800" }}
      borderRadius="md"
      border="subtle"
      shadow="base"
      transition="all 0.2s ease-in-out"
      _hover={{
        transform: "translateY(-4px)",
        shadow: "lg",
        borderColor: accentColor,
      }}
    >
      <Stack gap={4}>
        <Box
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          w="3rem"
          h="3rem"
          borderRadius="md"
          bg={`${accentColor.split('.')[0]}.50`}
          _dark={{ bg: `${accentColor.split('.')[0]}.900` }}
        >
          <Text fontSize="2xl">{icon}</Text>
        </Box>

        <Heading 
          fontSize="2xl" 
          fontWeight="600"
          fontFamily="heading"
          color="accent.800"
          _dark={{ color: "accent.100" }}
        >
          {title}
        </Heading>

        <Text 
          color="accent.600" 
          _dark={{ color: "accent.400" }} 
          fontSize="md"
          fontFamily="body"
          lineHeight="tall"
        >
          {description}
        </Text>
      </Stack>
    </Box>
  )
}

