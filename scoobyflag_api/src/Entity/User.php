<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["User:read"])]
    private ?int $id = null;
    
    #[ORM\Column(length: 180, unique: true)]
    #[Groups(["User:read"])]
    
    private ?string $email = null;
    
    #[ORM\Column]
    private array $roles = [];
    
    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Groups(["User:read"])]
    private ?string $password = null;
    
    #[ORM\Column(length: 255)]
    #[Groups(["User:read"])]
    private ?string $pseudo = null;

    #[ORM\OneToMany(mappedBy: 'gameMaster', targetEntity: GameTemplate::class)]
    private Collection $gameTemplates;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: UserGame::class)]
    private Collection $userGames;

    public function __construct()
    {
        $this->gameTemplates = new ArrayCollection();
        $this->userGames = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getPseudo(): ?string
    {
        return $this->pseudo;
    }

    public function setPseudo(string $pseudo): self
    {
        $this->pseudo = $pseudo;

        return $this;
    }

    /**
     * @return Collection<int, GameTemplate>
     */
    public function getGameTemplates(): Collection
    {
        return $this->gameTemplates;
    }

    public function addGameTemplate(GameTemplate $gameTemplate): self
    {
        if (!$this->gameTemplates->contains($gameTemplate)) {
            $this->gameTemplates->add($gameTemplate);
            $gameTemplate->setGameMaster($this);
        }

        return $this;
    }

    public function removeGameTemplate(GameTemplate $gameTemplate): self
    {
        if ($this->gameTemplates->removeElement($gameTemplate)) {
            // set the owning side to null (unless already changed)
            if ($gameTemplate->getGameMaster() === $this) {
                $gameTemplate->setGameMaster(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, UserGame>
     */
    public function getUserGames(): Collection
    {
        return $this->userGames;
    }

    public function addUserGame(UserGame $userGame): self
    {
        if (!$this->userGames->contains($userGame)) {
            $this->userGames->add($userGame);
            $userGame->setUser($this);
        }

        return $this;
    }

    public function removeUserGame(UserGame $userGame): self
    {
        if ($this->userGames->removeElement($userGame)) {
            // set the owning side to null (unless already changed)
            if ($userGame->getUser() === $this) {
                $userGame->setUser(null);
            }
        }

        return $this;
    }

}
