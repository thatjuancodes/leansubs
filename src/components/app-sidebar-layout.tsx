import { Box, Heading, Text, Button, Stack, HStack, VStack, IconButton } from '@chakra-ui/react'
import { LuUser, LuLogOut, LuSettings, LuUsers, LuCalendar, LuCreditCard, LuLayoutDashboard, LuMenu, LuX, LuChevronUp, LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { useAuth } from '@/context/auth.context'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

interface AppSidebarLayoutProps {
  children: React.ReactNode
}

export function AppSidebarLayout({ children }: AppSidebarLayoutProps) {
  const { user, organization, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  async function handleLogout() {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  function isActive(path: string): boolean {
    return location.pathname === path
  }

  function NavItem({ 
    icon: Icon, 
    label, 
    path, 
    onClick,
    variant = 'default',
    tooltip,
    isMobile = false
  }: { 
    icon: React.ElementType
    label: string
    path?: string
    onClick?: () => void
    variant?: 'default' | 'danger'
    tooltip?: string
    isMobile?: boolean
  }) {
    const active = path ? isActive(path) : false
    const isDanger = variant === 'danger'
    const shouldCollapse = isSidebarCollapsed && !isMobile

    function handleClick() {
      if (onClick) {
        onClick()
      } else if (path) {
        navigate(path)
        setIsMobileMenuOpen(false)
      }
    }

    return (
      <Button
        onClick={handleClick}
        w="full"
        justifyContent={shouldCollapse ? "center" : "flex-start"}
        variant="ghost"
        size="lg"
        px={shouldCollapse ? 2 : 4}
        py={3}
        bg={active ? "brand.50" : "transparent"}
        color={isDanger ? "danger.500" : (active ? "brand.600" : "accent.700")}
        _dark={{ 
          bg: active ? "brand.950" : "transparent",
          color: isDanger ? "danger.400" : (active ? "brand.300" : "accent.300")
        }}
        _hover={{
          bg: isDanger ? "danger.50" : (active ? "brand.100" : "accent.50"),
          _dark: {
            bg: isDanger ? "danger.950" : (active ? "brand.900" : "accent.800")
          }
        }}
        borderLeft={active ? "3px solid" : "3px solid transparent"}
        borderColor={active ? "brand.400" : "transparent"}
        borderRadius="0"
        transition="all 0.2s ease-in-out"
        fontWeight={active ? "600" : "500"}
        title={shouldCollapse ? (tooltip || label) : undefined}
      >
        {shouldCollapse ? (
          <Box as={Icon} fontSize="xl" />
        ) : (
          <HStack gap={3} w="full">
            <Box as={Icon} fontSize="xl" />

            <Text fontSize="md" fontFamily="body">
              {label}
            </Text>
          </HStack>
        )}
      </Button>
    )
  }

  function SidebarContent({ isMobile = false }: { isMobile?: boolean }) {
    return (
      <VStack gap={0} align="stretch" h="full">
        {/* Brand Logo & Organization with Collapse Button (Desktop Only) */}
        {!isMobile && (
          <Box p={isSidebarCollapsed ? 4 : 6} pb={4}>
            {isSidebarCollapsed ? (
              <VStack gap={3}>
                <Heading
                  fontSize="xl"
                  fontWeight="700"
                  bgGradient="to-r"
                  gradientFrom="brand.400"
                  gradientTo="secondary.500"
                  bgClip="text"
                  fontFamily="heading"
                  cursor="pointer"
                  onClick={() => {
                    navigate('/dashboard')
                    setIsMobileMenuOpen(false)
                  }}
                  textAlign="center"
                >
                  LS
                </Heading>

                <IconButton
                  aria-label="Expand sidebar"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarCollapsed(false)}
                  color="accent.600"
                  _dark={{ color: "accent.400" }}
                  _hover={{
                    bg: "accent.100",
                    _dark: { bg: "accent.700" }
                  }}
                >
                  <Box as={LuMenu} fontSize="md" />
                </IconButton>
              </VStack>
            ) : (
              <VStack gap={2} align="stretch">
                <HStack justify="space-between" align="center">
                  <Heading
                    fontSize="2xl"
                    fontWeight="700"
                    bgGradient="to-r"
                    gradientFrom="brand.400"
                    gradientTo="secondary.500"
                    bgClip="text"
                    fontFamily="heading"
                    cursor="pointer"
                    onClick={() => {
                      navigate('/dashboard')
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    LeanSubs
                  </Heading>

                  <IconButton
                    aria-label="Collapse sidebar"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSidebarCollapsed(true)}
                    color="accent.600"
                    _dark={{ color: "accent.400" }}
                    _hover={{
                      bg: "accent.100",
                      _dark: { bg: "accent.700" }
                    }}
                  >
                    <Box as={LuChevronLeft} fontSize="md" />
                  </IconButton>
                </HStack>

                {organization && (
                  <Text
                    fontSize="sm"
                    fontWeight="500"
                    color="accent.600"
                    _dark={{ color: "accent.400" }}
                    fontFamily="body"
                    noOfLines={1}
                  >
                    {organization.name}
                  </Text>
                )}
              </VStack>
            )}
          </Box>
        )}

        {/* Main Navigation */}
        <VStack gap={1} py={2} align="stretch" flex={1}>
          <NavItem icon={LuLayoutDashboard} label="Dashboard" path="/dashboard" isMobile={isMobile} />

          <NavItem icon={LuCreditCard} label="Subscriptions" path="/subscriptions" isMobile={isMobile} />

          <NavItem icon={LuUsers} label="Members" path="/members" isMobile={isMobile} />

          <NavItem icon={LuCalendar} label="Sessions" path="/sessions" isMobile={isMobile} />
        </VStack>

        {/* User Section - Dropup Menu */}
        <Box borderTop="1px solid" borderColor="accent.200" _dark={{ borderColor: "accent.700" }}>
          {/* Dropup Menu - Shows when open */}
          {isUserMenuOpen && (
            <VStack 
              gap={0} 
              align="stretch" 
              borderBottom="1px solid" 
              borderColor="accent.200" 
              _dark={{ borderColor: "accent.700" }}
              bg="white"
              _dark={{ bg: "accent.800" }}
            >
              <Button
                onClick={() => {
                  navigate('/profile')
                  setIsUserMenuOpen(false)
                  setIsMobileMenuOpen(false)
                }}
                w="full"
                justifyContent={isSidebarCollapsed && !isMobile ? "center" : "flex-start"}
                variant="ghost"
                size="md"
                px={isSidebarCollapsed && !isMobile ? 2 : 4}
                py={3}
                color="accent.700"
                _dark={{ color: "accent.300" }}
                _hover={{
                  bg: "accent.50",
                  _dark: { bg: "accent.700" }
                }}
                borderRadius="0"
                fontWeight="500"
                title={isSidebarCollapsed && !isMobile ? "Profile" : undefined}
              >
                {isSidebarCollapsed && !isMobile ? (
                  <Box as={LuUser} fontSize="lg" />
                ) : (
                  <HStack gap={3} w="full">
                    <Box as={LuUser} fontSize="lg" />

                    <Text fontSize="sm" fontFamily="body">
                      Profile
                    </Text>
                  </HStack>
                )}
              </Button>

              <Button
                onClick={() => {
                  navigate('/settings')
                  setIsUserMenuOpen(false)
                  setIsMobileMenuOpen(false)
                }}
                w="full"
                justifyContent={isSidebarCollapsed && !isMobile ? "center" : "flex-start"}
                variant="ghost"
                size="md"
                px={isSidebarCollapsed && !isMobile ? 2 : 4}
                py={3}
                color="accent.700"
                _dark={{ color: "accent.300" }}
                _hover={{
                  bg: "accent.50",
                  _dark: { bg: "accent.700" }
                }}
                borderRadius="0"
                fontWeight="500"
                title={isSidebarCollapsed && !isMobile ? "Settings" : undefined}
              >
                {isSidebarCollapsed && !isMobile ? (
                  <Box as={LuSettings} fontSize="lg" />
                ) : (
                  <HStack gap={3} w="full">
                    <Box as={LuSettings} fontSize="lg" />

                    <Text fontSize="sm" fontFamily="body">
                      Settings
                    </Text>
                  </HStack>
                )}
              </Button>

              <Button
                onClick={() => {
                  handleLogout()
                  setIsUserMenuOpen(false)
                  setIsMobileMenuOpen(false)
                }}
                w="full"
                justifyContent={isSidebarCollapsed && !isMobile ? "center" : "flex-start"}
                variant="ghost"
                size="md"
                px={isSidebarCollapsed && !isMobile ? 2 : 4}
                py={3}
                color="danger.500"
                _dark={{ color: "danger.400" }}
                _hover={{
                  bg: "danger.50",
                  _dark: { bg: "danger.950" }
                }}
                borderRadius="0"
                fontWeight="500"
                title={isSidebarCollapsed && !isMobile ? "Logout" : undefined}
              >
                {isSidebarCollapsed && !isMobile ? (
                  <Box as={LuLogOut} fontSize="lg" />
                ) : (
                  <HStack gap={3} w="full">
                    <Box as={LuLogOut} fontSize="lg" />

                    <Text fontSize="sm" fontFamily="body">
                      Logout
                    </Text>
                  </HStack>
                )}
              </Button>
            </VStack>
          )}

          {/* User Info Button - Always at Bottom */}
          {isSidebarCollapsed && !isMobile ? (
            <IconButton
              aria-label="User menu"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              w="full"
              variant="ghost"
              size="lg"
              py={4}
              bg="accent.50"
              _dark={{ bg: "accent.900" }}
              _hover={{
                bg: "accent.100",
                _dark: { bg: "accent.800" }
              }}
              borderRadius="0"
              color="accent.700"
              _dark={{ color: "accent.300" }}
              title={user?.name}
            >
              <Box as={LuSettings} fontSize="xl" />
            </IconButton>
          ) : (
            <Button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              w="full"
              justifyContent="space-between"
              variant="ghost"
              size="lg"
              px={4}
              py={4}
              bg="accent.50"
              _dark={{ bg: "accent.900" }}
              _hover={{
                bg: "accent.100",
                _dark: { bg: "accent.800" }
              }}
              borderRadius="0"
              h="auto"
            >
              <VStack gap={0} align="flex-start" flex={1}>
                <Text 
                  fontSize="sm" 
                  fontWeight="600" 
                  color="accent.800"
                  _dark={{ color: "accent.100" }}
                  fontFamily="body"
                  noOfLines={1}
                  textAlign="left"
                >
                  {user?.name}
                </Text>

                <Text 
                  fontSize="xs" 
                  color="accent.600"
                  _dark={{ color: "accent.400" }}
                  fontFamily="body"
                  noOfLines={1}
                  textAlign="left"
                >
                  {user?.email}
                </Text>
              </VStack>

              <Box 
                as={LuChevronUp} 
                fontSize="lg" 
                color="accent.600"
                _dark={{ color: "accent.400" }}
                transform={isUserMenuOpen ? "rotate(0deg)" : "rotate(180deg)"}
                transition="transform 0.2s ease-in-out"
              />
            </Button>
          )}
        </Box>
      </VStack>
    )
  }

  return (
    <Box minH="100vh" bg="light" _dark={{ bg: "dark" }}>
      {/* Mobile Header - Only visible on mobile */}
      <Box 
        bg="white" 
        _dark={{ bg: "accent.800", borderColor: "accent.700" }} 
        borderBottom="1px solid"
        borderColor="accent.200"
        position="sticky"
        top={0}
        zIndex={20}
        display={{ base: "block", lg: "none" }}
      >
        <HStack px={4} py={3} justify="space-between">
          <HStack gap={3}>
            <IconButton
              aria-label="Toggle menu"
              variant="ghost"
              size="md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Box as={isMobileMenuOpen ? LuX : LuMenu} fontSize="xl" />
            </IconButton>

            <Heading
              fontSize="xl"
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
          </HStack>
        </HStack>
      </Box>

      {/* Main Layout with Sidebar */}
      <Box display="flex" minH={{ base: "calc(100vh - 60px)", lg: "100vh" }}>
        {/* Desktop Sidebar */}
        <Box
          as="aside"
          w={isSidebarCollapsed ? "80px" : "280px"}
          bg="white"
          _dark={{ bg: "accent.800", borderColor: "accent.700" }}
          borderRight="1px solid"
          borderColor="accent.200"
          display={{ base: "none", lg: "flex" }}
          position="sticky"
          top={0}
          h="100vh"
          overflowY="auto"
          flexDirection="column"
          transition="width 0.3s ease-in-out"
        >
          <SidebarContent />
        </Box>

        {/* Mobile Sidebar Overlay */}
        <>
          {/* Backdrop with fade animation */}
          <Box
            position="fixed"
            top="60px"
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.600"
            zIndex={30}
            display={{ base: "block", lg: "none" }}
            onClick={() => setIsMobileMenuOpen(false)}
            opacity={isMobileMenuOpen ? 1 : 0}
            pointerEvents={isMobileMenuOpen ? "auto" : "none"}
            transition="opacity 0.3s ease-in-out"
          />

          {/* Mobile Sidebar with slide animation */}
          <Box
            position="fixed"
            top="60px"
            left={0}
            bottom={0}
            w="280px"
            bg="white"
            _dark={{ bg: "accent.800", borderColor: "accent.700" }}
            borderRight="1px solid"
            borderColor="accent.200"
            zIndex={40}
            display={{ base: "flex", lg: "none" }}
            flexDirection="column"
            overflowY="auto"
            shadow="xl"
            transform={isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)"}
            transition="transform 0.3s ease-in-out"
          >
            <SidebarContent isMobile={true} />
          </Box>
        </>

        {/* Main Content Area */}
        <Box flex={1} overflowX="hidden">
          {children}
        </Box>
      </Box>
    </Box>
  )
}
