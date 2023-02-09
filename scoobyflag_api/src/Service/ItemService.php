<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use App\Repository\ItemRepository;
use App\Entity\Item;
use Symfony\Component\Serializer\SerializerInterface;

class ItemService
{
    public EntityManagerInterface $em;
    private ItemRepository $itemRepository;
    private SerializerInterface $serializer;

    public function __construct(EntityManagerInterface $em, ItemRepository $itemRepository, SerializerInterface $serializer)
    {
        $this->em = $em;
        $this->itemRepository = $itemRepository;
        $this->serializer = $serializer;
    }

    public function createAll()
    {
        $objects = ['Loupe', 'Piège', 'Lunettes de Véra', 'Sac à dos de Scooby', 'Cape d\'invisibilité', 'Part de pizza', 'Boussole'];
        $existantObject = $this->itemRepository->findAll();
    }

    public function save(Item $item)
    {
        $this->em->persist($item);
        $this->em->flush($item);
    }
}
