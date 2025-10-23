import { Box, Container, Heading, Text, Stack, SimpleGrid, Badge, Flex } from '@chakra-ui/react'

/**
 * BrandShowcase - Visual reference of LeanSubs brand colors and components
 * This component demonstrates the brand styleguide in action
 * Remove this component in production or use for internal documentation
 */
export function BrandShowcase() {
  return (
    <Container maxW="container.xl" py={16}>
      <Stack gap={12}>
        <Stack gap={4}>
          <Heading fontFamily="heading" fontSize="4xl" fontWeight="700" color="accent.800" _dark={{ color: "accent.100" }}>
            LeanSubs Brand Showcase
          </Heading>

          <Text fontFamily="body" fontSize="lg" color="accent.600" _dark={{ color: "accent.400" }}>
            Visual reference for brand colors, typography, and components
          </Text>
        </Stack>

        {/* Color Palette */}
        <Stack gap={6}>
          <Heading fontFamily="heading" fontSize="2xl" fontWeight="600" color="accent.800" _dark={{ color: "accent.100" }}>
            Color Palette
          </Heading>

          <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
            <ColorSwatch color="brand.400" label="Primary" hex="#4CA9FF" />
            <ColorSwatch color="secondary.500" label="Secondary" hex="#B794F4" />
            <ColorSwatch color="accent.700" label="Accent" hex="#334155" />
            <ColorSwatch color="success.500" label="Success" hex="#22C55E" />
            <ColorSwatch color="warning.300" label="Warning" hex="#FDBA74" />
            <ColorSwatch color="danger.400" label="Danger" hex="#F87171" />
          </SimpleGrid>
        </Stack>

        {/* Typography */}
        <Stack gap={6}>
          <Heading fontFamily="heading" fontSize="2xl" fontWeight="600" color="accent.800" _dark={{ color: "accent.100" }}>
            Typography
          </Heading>

          <Stack gap={3}>
            <Heading fontFamily="heading" fontSize="4xl" fontWeight="700" color="accent.800" _dark={{ color: "accent.100" }}>
              Heading 1 - Poppins Bold
            </Heading>

            <Heading fontFamily="heading" fontSize="3xl" fontWeight="700" color="accent.800" _dark={{ color: "accent.100" }}>
              Heading 2 - Poppins Bold
            </Heading>

            <Heading fontFamily="heading" fontSize="2xl" fontWeight="600" color="accent.800" _dark={{ color: "accent.100" }}>
              Heading 3 - Poppins SemiBold
            </Heading>

            <Text fontFamily="body" fontSize="lg" color="accent.600" _dark={{ color: "accent.400" }}>
              Body Large - IBM Plex Sans Regular
            </Text>

            <Text fontFamily="body" fontSize="md" color="accent.600" _dark={{ color: "accent.400" }}>
              Body Medium - IBM Plex Sans Regular
            </Text>

            <Text fontFamily="body" fontSize="sm" color="accent.600" _dark={{ color: "accent.400" }}>
              Body Small - IBM Plex Sans Regular
            </Text>
          </Stack>
        </Stack>

        {/* Status Badges */}
        <Stack gap={6}>
          <Heading fontFamily="heading" fontSize="2xl" fontWeight="600" color="accent.800" _dark={{ color: "accent.100" }}>
            Status Badges
          </Heading>

          <Flex gap={4} flexWrap="wrap">
            <Badge backgroundColor="success.500" color="white" px={3} py={1} borderRadius="md">
              Active
            </Badge>

            <Badge backgroundColor="warning.300" color="accent.800" px={3} py={1} borderRadius="md">
              Expiring Soon
            </Badge>

            <Badge backgroundColor="danger.400" color="white" px={3} py={1} borderRadius="md">
              Cancelled
            </Badge>

            <Badge backgroundColor="brand.400" color="white" px={3} py={1} borderRadius="md">
              New
            </Badge>

            <Badge backgroundColor="secondary.500" color="white" px={3} py={1} borderRadius="md">
              Premium
            </Badge>
          </Flex>
        </Stack>

        {/* Shadow Examples */}
        <Stack gap={6}>
          <Heading fontFamily="heading" fontSize="2xl" fontWeight="600" color="accent.800" _dark={{ color: "accent.100" }}>
            Shadows
          </Heading>

          <SimpleGrid columns={{ base: 2, md: 5 }} gap={6}>
            <ShadowBox shadow="sm" label="Small" />
            <ShadowBox shadow="base" label="Base" />
            <ShadowBox shadow="md" label="Medium" />
            <ShadowBox shadow="lg" label="Large" />
            <ShadowBox shadow="xl" label="Extra Large" />
          </SimpleGrid>
        </Stack>
      </Stack>
    </Container>
  )
}

interface ColorSwatchProps {
  color: string
  label: string
  hex: string
}

function ColorSwatch({ color, label, hex }: ColorSwatchProps) {
  return (
    <Stack gap={2}>
      <Box
        bg={color}
        h="100px"
        borderRadius="md"
        border="subtle"
        transition="all 0.2s ease-in-out"
        _hover={{
          transform: "scale(1.05)",
          shadow: "lg"
        }}
      />

      <Stack gap={1}>
        <Text fontFamily="heading" fontSize="sm" fontWeight="600" color="accent.800" _dark={{ color: "accent.100" }}>
          {label}
        </Text>

        <Text fontFamily="body" fontSize="xs" color="accent.500" _dark={{ color: "accent.500" }}>
          {hex}
        </Text>
      </Stack>
    </Stack>
  )
}

interface ShadowBoxProps {
  shadow: string
  label: string
}

function ShadowBox({ shadow, label }: ShadowBoxProps) {
  return (
    <Stack gap={2}>
      <Box
        bg="white"
        _dark={{ bg: "accent.800" }}
        h="80px"
        borderRadius="md"
        shadow={shadow}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontFamily="body" fontSize="sm" color="accent.600" _dark={{ color: "accent.400" }}>
          {label}
        </Text>
      </Box>
    </Stack>
  )
}

